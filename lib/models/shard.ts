import { connectWebSocket, isWebSocketCloseEvent } from 'https://deno.land/std/ws/mod.ts';
import Client from '../client.ts';
import { Presence } from '../interfaces/interface.ts';
import { red } from 'https://deno.land/std/fmt/colors.ts';

/**
 * A descord shard for sharded bots.
 */
export default class Shard {
  readonly wsUrl: string;
  #eventManager: Map<string, (...params: any[]) => void>;
  readonly client: Client;
  readonly id: number;
  readonly total: number;
  #isReady: boolean;
  #sequence: number;
  #heartbeat: number;
  #interval: number;
  #session: string;
  #retries: number;

  #ws: any;

  /**
   * Create a new shard (instantly connects to the discord ws server).
   */
  constructor(
    client: Client,
    shardInfo: { shardId: number; total: number } = { shardId: 0, total: 1 },
    wsBase: string,
    presence: Presence
  ) {
    this.client = client;
    this.#isReady = false;
    this.#sequence = -1;
    this.#interval = -1;
    this.#heartbeat = -1;
    this.#session = '';
    this.id = shardInfo.shardId;
    this.total = shardInfo.total;
    this.#retries = 3;
    this.#eventManager = new Map();
    this.wsUrl = wsBase;

    connectWebSocket(wsBase).then((ws) => {
      this.#ws = ws;
      this.handleEvents(this.identify(presence));
    });
  }

  /**
   * Whether the shard is connected or not.
   */
  get isReady() {
    return this.#isReady;
  }

  /**
   * The heartbeat interval for the shard.
   */
  get interval() {
    return this.#interval;
  }

  /**
   * The websocket representation of the shard.
   */
  get ws() {
    return this.#ws;
  }

  /**
   * Add an event handler for the shard's events.
   */
  on(event: string, handler: (...params: any[]) => void) {
    if (!this.#eventManager.get(event)) this.#eventManager.set(event, handler);
    else {
      throw new Error(
        "An event handler is already set for the event '" + event + "'. You can only set 1 handler per event."
      ).stack;
    }
  }

  /**
   * Fires the shard's events.
   */
  emit(event: string, ...params: any[]) {
    if (this.#eventManager.get(event)) {
      this.#eventManager.get(event)!(...params);
    }
  }

  /**
   * generates an identify payload for the shard.
   */
  private identify(presence: Presence) {
    return {
      op: 2,
      d: {
        token: this.client.token,
        properties: {
          $os: Deno.build.os,
          $browser: 'descord',
          $device: 'descord'
        },
        shard: [this.id, this.total],
        presence: {
          status: presence?.status || 'online',
          since: Date.now(),
          game: presence?.game,
          afk: presence?.afk
        }
      }
    };
  }

  /**
   * Handles raw discord events.
   */
  async handleEvents(identify: any) {
    for await (const msg of this.#ws) {
      if (typeof msg === 'string') {
        let raw = JSON.parse(msg);
        if (raw.s !== null && raw.s > -1) this.#sequence = raw.s;
        this.client.emit('raw', raw);
        if (raw.op === 10) {
          this.#heartbeat = raw.d['heartbeat_interval'];
          this.#ws.send(
            JSON.stringify({
              op: 1,
              d: this.#sequence === -1 ? null : this.#sequence
            })
          );
          this.#interval = setInterval(() => {
            this.#ws.send(
              JSON.stringify({
                op: 1,
                d: this.#sequence === -1 ? null : this.#sequence
              })
            );
          }, this.#heartbeat);
        } else if (raw.op === 11 && !this.#isReady) {
          this.#ws.send(JSON.stringify(identify));
        } else if (raw.op === 0) {
          switch (raw.t.toLowerCase()) {
            case 'ready':
              this.#retries = 3;
              this.#isReady = true;
              this.#session = raw.d['session_id'];
              this.emit('ready', raw.d);
              break;
            case 'guild_create':
              this.client.guilds.set(raw.d.id, raw.d);
              this.emit('guildCreate', raw.d);
              break;
            case 'channel_create':
              this.emit('channelCreate', raw.d);
              break;
            case 'channel_update':
              this.emit('channelUpdate', raw.d);
              break;
            case 'channel_delete':
              this.emit('channelDelete', raw.d);
              break;
            case 'channel_pins_update':
              this.emit('channelPinsUpdate', raw.d);
              break;
            case 'guild_update':
              this.emit('guildUpdate', raw.d);
              break;
            case 'guild_delete':
              this.emit('guildDelete', raw.d);
              break;
            case 'guild_ban_add':
              this.emit('guildBanAdd', raw.d);
              break;
            case 'guild_ban_remove':
              this.emit('guildBanRemove', raw.d);
              break;
            case 'guild_emojis_update':
              this.emit('guildEmojisUpdate', raw.d);
              break;
            case 'guild_integrations_update':
              this.emit('guildIntegrationsUpdate', raw.d);
              break;
            case 'guild_member_add':
              this.emit('guildMemberAdd', raw.d);
              break;
            case 'guild_member_remove':
              this.emit('guildMemberRemove', raw.d);
              break;
            case 'guild_member_update':
              this.emit('guildMemberUpdate', raw.d);
              break;
            case 'guild_members_chunk':
              this.emit('guildMembersChunk', raw.d);
              break;
            case 'guild_role_create':
              this.emit('guildRoleCreate', raw.d);
              break;
            case 'guild_role_update':
              this.emit('guildRoleUpdate', raw.d);
              break;
            case 'guild_role_delete':
              this.emit('guildRoleDelete', raw.d);
              break;
            case 'invite_create':
              this.emit('inviteCreate', raw.d);
              break;
            case 'invite_delete':
              this.emit('inviteDelete', raw.d);
              break;
            case 'message_create':
              this.emit('messageCreate', raw.d);
              break;
            case 'message_update':
              this.emit('messageUpdate', raw.d);
              break;
            case 'message_delete':
              this.emit('messageDelete', raw.d);
              break;
            case 'message_delete_bulk':
              this.emit('messageDeleteBulk', raw.d);
              break;
            case 'message_reaction_add':
              this.emit('messageReactionAdd', raw.d);
              break;
            case 'message_reaction_remove':
              this.emit('messageReactionRemove', raw.d);
              break;
            case 'message_reaction_remove_all':
              this.emit('messageReactionRemoveAll', raw.d);
              break;
            case 'message_reaction_remove_emoji':
              this.emit('messageReactionRemoveEmoji', raw.d);
              break;
            case 'presence_update':
              this.emit('presenceUpdate', raw.d);
              break;
            case 'typing_start':
              this.emit('typingStart', raw.d);
              break;
            case 'user_update':
              this.emit('userUpdate', raw.d);
              break;
            case 'voice_state_update':
              this.emit('voiceStateUpdate', raw.d);
              break;
            case 'voice_server_update':
              this.emit('voiceServerUpdate', raw.d);
              break;
            case 'webhooks_update':
              this.emit('webhooksUpdate', raw.d);
              break;
          }
        } else if (raw.op === 9) {
          this.#retries -= 1;
          if (this.#retries > -1) {
            console.error(
              red(`INVALID SESSION.\nResumable? ${raw.d}.${!raw.d ? '\nRetrying to connect in 5 seconds.' : ''}`)
            );
            if (raw.d) this.resume();
            else this.reconnect();
          } else this.client.wsClose(this.id);
        } else if (raw.op === 7) {
          this.#retries -= 1;
          this.reconnect();
        }
      } else if (isWebSocketCloseEvent(msg)) {
        this.client.emit(
          'debug',
          red(
            `Connection closed by discord.\nError code:\t${msg.code}.\nError reason:\t${msg.reason}.\nShard ID:\t${
              this.id + 1
            } of ${this.total}.`
          )
        );
      }
    }
  }

  /**
   * Resumes the websocket session with the discord servers.
   */
  resume() {
    this.client.emit('resuming');
    this.ws.send(
      JSON.stringify({
        op: 6,
        d: {
          token: this.client.token,
          session_id: this.#session || null,
          seq: this.#sequence || 0
        }
      })
    );
  }

  reconnect() {
    this.client.emit('reconnecting');
    this.ws.close();
    this.#ws = connectWebSocket(this.wsUrl);
    setTimeout(() => {
      this.ws.send(JSON.stringify(this.identify(this.client.user.presence || { status: 'online' })));
    }, 5000);
  }
}
