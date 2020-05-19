import { green, yellow } from 'https://deno.land/std/fmt/colors.ts';
import { HTTPError } from './errors/error.ts';
import { Collection, HTTPClient } from './utils/util.ts';
import { ClientUser, Shard } from './models/model.ts';
import { Presence } from './interfaces/interface.ts';

/**
 * The discord API Wrapper client that lets you interact with the API.
 */
class Client {
  #eventHandler: Map<string, (...params: any[]) => void>;
  #httpBase: string;
  #wsBase: string;
  #token?: string;
  #guilds: Collection<string, any>;
  #user?: ClientUser;
  #clientId?: string;
  #shardCount: number;

  shardManager: Collection<number, Shard>;
  owners: string[];
  http: HTTPClient;

  /**
   * Create a new descord client.
   */
  constructor() {
    this.#eventHandler = new Map();
    this.#httpBase = 'https://discord.com/api/v6';
    this.#wsBase = '';
    this.#shardCount = 1;
    this.#guilds = new Collection();

    this.shardManager = new Collection();
    this.owners = [];
    this.http = new HTTPClient(this, { apiVersion: 6 });
  }

  /**
   * Set a new event handler for a specific event of the descord client.
   * @param event The event that needs to be handled.
   * @param handler The callback function which is called when the event is fired.
   */
  addEventListener(event: string, handler: (...params: any[]) => void) {
    if (this.#eventHandler.get(event))
      throw `Event handler already set for event: ${event}. Only one handler per event is allowed`;
    else this.#eventHandler.set(event, handler);
  }

  /**
   * Set a new event handler for a specific event of the descord client.
   * @param event The event that needs to be handled.
   * @param handler The callback function which is called when the event is fired.
   */
  on(event: string, handler: (...params: any[]) => void) {
    this.addEventListener(event, handler);
  }

  /**
   * The discord bot token provided during login.
   */
  get token() {
    return this.#token!;
  }

  /**
   * The logged in bot as a discord user.
   */
  get user() {
    return this.#user!;
  }

  /**
   * The logged in bot's application ID.
   */
  get clientId() {
    return this.#clientId!;
  }

  /**
   * The collection of the discord guilds to which the logged in bot has been added.
   */
  get guilds() {
    return this.#guilds;
  }

  /**
   * Sends a websocket payload to the discord server as a specific shard or all shards.
   * 
   * @param data The data to be sent.
   * @param shardId The shard which has to send the data (if only a specific shard needs to send this data).
   */
  wsSend(data: { op: number; d: any }, shardId?: number) {
    if (!data) throw new Error('No data to send.').stack;
    else {
      if (!shardId) this.shardManager.each((shard) => shard.ws.send(JSON.stringify(data)));
      else {
        if (this.shardManager.get(shardId))
          this.shardManager.get(shardId).ws.send(JSON.stringify(data));
        else throw new Error('Invalid shard ID.').stack;
      }
    }
  }

  /**
   * Closes a specific shard's connection to discord.
   * 
   * @param shardId The shard that needs to be closed.
   */
  wsClose(shardId?: number) {
    if (shardId) {
      if (this.shardManager.get(shardId)) {
        this.shardManager.get(shardId).ws.close();
        this.shardManager.delete(shardId);
        this.emit('shardDisconnected', shardId);
      } else throw new Error('Invalid shard ID.').stack;
    } else {
      this.shardManager.each((shard) => shard.ws.close());
      this.shardManager.clear();
      this.emit('disconnected');
    }
  }

  /**
   * Emits one of the client's event for the handler to handle.
   * 
   * @param event the event to be emitted.
   * @param params The parameters to be passed onto the event handler.
   */
  emit(event: string, ...params: any[]) {
    if (this.#eventHandler.get(event))
      this.#eventHandler.get(event)!(...params);
  }

  /**
   * Connects to the discord servers and logs in as the bot.
   * 
   * @param token The discord bot token.
   * @param options Additional login options.
   */
  async login(
    token: string,
    options: { presence: Presence } = {
      presence: { status: 'online', afk: false }
    }
  ) {
    try {
      this.#clientId = atob(token.split('.')[0]);

      this.emit('debug', yellow('Getting gateway info.'));
      let gatewayResponse = await fetch(`${this.#httpBase}/gateway/bot`, {
        method: 'GET',
        headers: { Authorization: `Bot ${token}` }
      });
      if (gatewayResponse.status !== 200) {
        throw new HTTPError(gatewayResponse).stack;
      }
      let gateway = await gatewayResponse.json();
      this.emit('debug', green('Gateway info successfully fetched.'));
      this.#token = token;
      this.#wsBase = gateway.url + '?v=6&encoding=6';
      this.#shardCount = gateway.shards;

      this.emit('debug', yellow('Trying to connect to discord ws servers.'));
      for (let i = 0; i < this.#shardCount; i++) {
        let newShard = new Shard(
          this,
          { shardId: i, total: this.#shardCount },
          this.#wsBase,
          options.presence
        );
        newShard.on('ready', (rawData) => {
          this.#user = new ClientUser(this, rawData['user']);
          rawData.guilds.forEach((guild: any) => {
            this.guilds.set(guild.id, guild);
          });
          if (newShard.id === 0) this.emit('ready');
        });
        this.shardManager.set(i, newShard);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default Client;
