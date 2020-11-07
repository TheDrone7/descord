import Client from '../client.ts';
import { ClientPresence, GatewayPayload, Hello, Intent, ReadyPayload } from '../types/types.ts';
import { ClientUser } from "./models.ts";


const intents = ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_EMOJIS', 'GUILD_INTEGRATIONS', 'GUILD_WEBHOOKS', 'GUILD_INVITES', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'];
const activityTypes = ['PLAYING', 'STREAMING', 'LISTENING', 'CUSTOM', 'COMPETING'];

interface LoginOptions {
  intent: Intent[],
  shard: [number, number],
  presence?: ClientPresence
}

export default class Shard {
  #options: LoginOptions
  ws: WebSocket;

  #session: string;
  #sequence: number;
  #heartbeat: number;
  #ready: boolean;

  client: Client;

  constructor(client: Client, url: string, options: LoginOptions) {
    this.client = client;
    this.#options = options;

    this.#heartbeat = -1;
    this.#session = 'null';
    this.#sequence = -1;
    this.#ready = false;

    this.ws = new WebSocket(url);

    this.ws.onopen = async function () {
      client.log('DEBUG', `Connected shard ${options.shard[0] + 1} of ${options.shard[1]}.`);
    }

    this.ws.onclose = async function (event: CloseEvent) {
      if (event.code === 1000) client.log('DEBUG', `Shard ${options.shard[0] + 1} of ${options.shard[1]} safely disconnected.`);
      else client.logError('ERROR', new Error(`Shard ${options.shard[0] + 1} of ${options.shard[1]} disconnected with code ${event.code} due to reason ${event.reason}.`));
    }

    this.ws.onerror = (error: Event) => {
      client.logError('ERROR', new Error(error.toString()));
    }

    this.ws.onmessage = async (event: MessageEvent) => {
      await this.handleEvent(JSON.parse(event.data) as GatewayPayload);
    }
  }

  async handleEvent(raw: GatewayPayload) {
    this.client.execute('raw', raw);
    if (raw.s) this.#sequence = raw.s;
    switch (raw.op) {
      case 10:
        let data = raw.d as Hello;
        this.#heartbeat = data.heartbeat_interval;
        this.ws.send(JSON.stringify({ op: 1, d: this.#sequence === -1 ? null : this.#sequence }));
        setInterval(() => this.ws.send(JSON.stringify({
          op: 1,
          d: this.#sequence === -1 ? null : this.#sequence
        })), this.#heartbeat);
        break;

      case 11:
        if (!this.#ready) {
          this.ws.send(JSON.stringify({
            op: 2,
            d: {
              token: this.client.token,
              intents: this.#options.intent.map(i => 1 << intents.indexOf(i)).reduce((a, c) => a | c),
              properties: {
                $os: 'linux',
                $browser: 'descord',
                $device: 'descord'
              },
              shard: this.#options.shard,
              presence: this.#options.presence ? {
                status: this.#options.presence.status.toLowerCase(),
                activities: this.#options.presence.activities?.map(x => {
                  return { name: x.name, type: activityTypes.indexOf(x.type), url: x.url };
                }) || null,
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
            this.client.log('DEBUG', `Ready event received for shard ${this.#options.shard[0] + 1} of ${this.#options.shard[1]}`);
            let readyData = raw.d as ReadyPayload;
            if (this.#options.shard[0] === 0) {
              this.client.user = new ClientUser(this.client, readyData.user);
              this.#session = readyData.session_id;
            }
            break;
          case 'GUILD_CREATE':
            if (raw.d.id === '436813926735413248')
              await Deno.writeTextFile('./guilds.json', JSON.stringify(raw.d));
            break;
        }
    }
  }
}