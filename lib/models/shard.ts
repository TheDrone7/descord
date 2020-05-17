import {
  connectWebSocket,
  isWebSocketCloseEvent
} from 'https://deno.land/std/ws/mod.ts';
import Client from '../client.ts';
import { Presence } from '../interfaces/interface.ts';
import { green, red, yellow } from 'https://deno.land/std/fmt/colors.ts';

export default class Shard {
  #eventManager: Map<string, (...params: any[]) => void>;
  #client: Client;
  #id: number;
  #total: number;
  #isReady: boolean;
  #sequence: number;
  #heartbeat: number;
  #interval: number;
  #session: string;
  #retries: number;

  #ws: any;

  get client() {
    return this.#client;
  }
  get id() {
    return this.#id;
  }
  get isReady() {
    return this.#isReady;
  }
  get interval() {
    return this.#interval;
  }

  constructor(
    client: Client,
    shardInfo: { shardId: number; total: number } = { shardId: 0, total: 1 },
    wsBase: string,
    presence: Presence
  ) {
    this.#client = client;
    this.#isReady = false;
    this.#sequence = -1;
    this.#interval = -1;
    this.#heartbeat = -1;
    this.#session = '';
    this.#id = shardInfo.shardId;
    this.#total = shardInfo.total;
    this.#retries = 3;
    this.#eventManager = new Map();

    connectWebSocket(wsBase).then((ws) => {
      this.#ws = ws;
      this.handleEvents(this.identify(presence));
    });
  }

  get ws() {
    return this.#ws;
  }

  on(event: string, handler: (...params: any[]) => void) {
    if (!this.#eventManager.get(event)) this.#eventManager.set(event, handler);
    else {
      throw new Error(
        "An event handler is already set for the event '" +
          event +
          "'. You can only set 1 handler per event."
      ).stack;
    }
  }

  emit(event: string, ...params: any[]) {
    if (this.#eventManager.get(event)) {
      this.#eventManager.get(event)!(...params);
    }
  }

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
        shard: [this.#id, this.#total],
        presence: {
          status: presence?.status || 'online',
          since: presence?.status === 'idle' ? Date.now() : null,
          game: presence?.game,
          afk: presence?.afk
        }
      }
    };
  }

  async handleEvents(identify: any) {
    for await (const msg of this.#ws) {
      if (typeof msg === 'string') {
        let raw = JSON.parse(msg);
        if (raw.s !== null && raw.s > -1) this.#sequence = raw.s;
        this.#client.emit('raw', raw);

        if (raw.op === 10) {
          this.#heartbeat = raw.d['heartbeat_interval'];
          this.#ws.send(
            JSON.stringify({
              op: 1,
              d: this.#sequence === -1 ? null : this.#sequence
            })
          );
          setInterval(() => {
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
              this.emit('guildCreate', raw.d);
              break;
          }
        }
      } else if (isWebSocketCloseEvent(msg)) {
        this.client.emit(
          'debug',
          red(
            `Connection closed by discord.\nError code:\t${
              msg.code
            }.\nError reason:\t${msg.reason}.\nShard ID:\t${this.#id + 1} of ${
              this.#total
            }.`
          )
        );
      }
    }
  }
}
