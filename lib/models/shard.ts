import Client from '../client.ts';
import { ClientPresence, GatewayPayload, Hello, Intent } from '../types/types.ts';


const intents = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'];
const activityTypes = ['PLAYING', 'STREAMING', 'LISTENING', 'CUSTOM', 'COMPETING'];

interface LoginOptions {
    intent: Intent[],
    shard: [number, number],
    presence?: ClientPresence
}

export default class Shard {
    #options: LoginOptions
    #ws: WebSocket;

    #session: number;
    #heartbeat: number;
    #ready: boolean;

    client: Client;

    constructor(client: Client, url: string, options: LoginOptions) {
        this.client = client;
        this.#options = options;

        this.#heartbeat = -1;
        this.#session = -1;
        this.#ready = false;

        this.#ws = new WebSocket(url);

        this.#ws.onopen = async function () {
            client.log('DEBUG', `Connected shard ${options.shard[0] + 1} of ${options.shard[1]}.`);
        }

        this.#ws.onclose = async function (event: CloseEvent) {
            if (event.code === 1000) client.log('DEBUG', `Shard ${options.shard[0] + 1} of ${options.shard[1]} safely disconnected.`);
            else client.logError('ERROR', new Error(`Shard ${options.shard[0] + 1} of ${options.shard[1]} disconnected with code ${event.code} due to reason ${event.reason}.`));
        }

        this.#ws.onerror = (error: Event) => {
            client.logError('ERROR', new Error(error.toString()));
        }

        this.#ws.onmessage = async (event: MessageEvent) => {
            await this.handleEvent(JSON.parse(event.data) as GatewayPayload);
        }
    }

    handleEvent(raw: GatewayPayload) {
        this.client.execute('raw', raw);
        if (raw.s) this.#session = raw.s;
        switch (raw.op) {
            case 10:
                let data = raw.d as Hello;
                this.#heartbeat = data.heartbeat_interval;
                this.#ws.send(JSON.stringify({ op: 1, d: this.#session === -1 ? null : this.#session }));
                setInterval(() => this.#ws.send(JSON.stringify({ op: 1, d: this.#session === -1 ? null : this.#session })), this.#heartbeat);
                break;
            
            case 11:
                if (!this.#ready) {
                    console.log(this.#options.presence ? {
                        status: this.#options.presence.status.toLowerCase(),
                        activities: this.#options.presence.activities?.map(x => { return { name: x.name, type: activityTypes.indexOf(x.type), url: x.url }; }) || null,
                        afk: this.#options.presence.afk || false,
                        since: this.#options.presence.since || this.#options.presence.status === 'IDLE' ? Date.now() : null
                    } : undefined);
                    this.#ws.send(JSON.stringify({
                        op: 2,
                        d: {
                            token: this.client.token,
                            intents: this.#options.intent.map(i => 1 << intents.indexOf(i)).reduce((a, c) => a + c),
                            properties: {
                                $os: 'linux',
                                $browser: 'descord',
                                $device: 'descord'
                            },
                            shard: this.#options.shard,
                            presence: this.#options.presence ? {
                                status: this.#options.presence.status.toLowerCase(),
                                activities: this.#options.presence.activities?.map(x => { return { name: x.name, type: activityTypes.indexOf(x.type), url: x.url }; }) || null,
                                afk: this.#options.presence.afk || false,
                                since: this.#options.presence.since || Date.now()
                            } : undefined
                        }
                    }));
                }
                break;
            case 0:
                switch (raw.t) {
                    case 'READY':
                        this.#ready = true;
                        break;
                }
        }
    }
}