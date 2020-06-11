import { green, red, yellow } from 'https://deno.land/std/fmt/colors.ts';
import { HTTPError } from './errors/error.ts';
import { Collection, HTTPClient } from './utils/util.ts';
import { ClientUser, Shard } from './models/model.ts';
import { Presence } from './interfaces/interface.ts';

/**
 * The discord API Wrapper client that lets you interact with the API.
 */
class Client {
  #eventHandler: Map<string, (...params: any[]) => void>;
  readonly httpBase: string;
  #wsBase: string;
  #token?: string;
  readonly guilds: Collection<string, any>;
  readonly channels: Collection<string, any>;
  readonly messages: Collection<string, any>;
  readonly users: Collection<string, any>;
  #user?: ClientUser;
  #clientId?: string;
  #shardCount: number;
  #ready: boolean;

  shardManager: Collection<number, Shard>;
  owners: string[];
  http: HTTPClient;

  /**
   * Create a new descord client.
   */
  constructor() {
    this.#eventHandler = new Map();
    this.httpBase = 'https://discord.com/api/v6';
    this.#wsBase = '';
    this.#shardCount = 1;
    this.guilds = new Collection();
    this.channels = new Collection();
    this.messages = new Collection();
    this.users = new Collection();
    this.#ready = false;

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
      throw new Error(`Event handler already set for event: ${event}. Only one handler per event is allowed`).stack;
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
   * Remove an already set event listener or do nothing.
   * @param event
   */
  removeListener(event: string) {
    this.#eventHandler.delete(event);
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
   * Whether the bot is logged in or not.
   */
  get isReady() {
    return this.#ready;
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
        if (this.shardManager.get(shardId)) this.shardManager.get(shardId).ws.send(JSON.stringify(data));
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
    if (this.#eventHandler.get(event)) this.#eventHandler.get(event)!(...params);
  }

  /**
   * Connects to the discord servers and logs in as the bot.
   *
   * @param token The discord bot token.
   * @param options Additional login options.
   */
  async login(
    token: string,
    options: { presence: Presence; sharding?: { shardId: number; totalShards: number }; shardCount?: number } = {
      presence: { status: 'online', afk: false }
    }
  ) {
    try {
      this.#clientId = atob(token.split('.')[0]);

      this.emit('debug', yellow('Getting gateway info.'));
      let gatewayResponse = await fetch(`${this.httpBase}/gateway/bot`, {
        method: 'GET',
        headers: { Authorization: `Bot ${token}` }
      });
      if (gatewayResponse.status !== 200) {
        throw new HTTPError(gatewayResponse).stack;
      }
      let gateway = await gatewayResponse.json();
      if (gateway['session_start_limit'].remaining < 1) {
        console.error(
          red(
            `You've hit your connection limit. The limit will reset on ${new Date(
              Date.now() + gateway['session_start_limit'].reset_after
            )}`
          )
        );
        Deno.exit(-1);
      }
      this.emit('debug', green('Gateway info successfully fetched.'));
      this.#token = token;
      this.#wsBase = gateway.url + '?v=6&encoding=6';
      this.#shardCount = options.shardCount || gateway.shards;

      this.emit('debug', yellow('Trying to connect to discord ws servers.'));
      if (options.sharding) {
        this.#shardCount = options.sharding.totalShards;
        this.instantiateShard(options.sharding.shardId, options.presence);
      } else {
        for (let i = 0; i < this.#shardCount; i++) {
          this.instantiateShard(i, options.presence);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  private instantiateShard(shardId: number, presence: Presence) {
    setTimeout(() => {
      let newShard = new Shard(this, { shardId: shardId, total: this.#shardCount }, this.#wsBase, presence);
      newShard.on('ready', (rawData) => {
        rawData.guilds.forEach((guild: any) => {
          this.guilds.set(guild.id, guild);
        });
        this.emit('shardReady', newShard.id);
        if (this.shardManager.size === this.#shardCount && this.shardManager.every((shard) => shard.isReady)) {
          this.#user = new ClientUser(this, rawData['user'], presence);
        }
      });
      newShard.on('guildCreate', (guild: any) => {
        this.guilds.set(guild.id, guild);
        guild.members.map((x: any) => {
          x.user.presence = guild.presences.find((p: any) => p.user.id === x.user.id);
          return x;
        });
        delete guild.presences;
        guild.members.forEach((member: any) => this.users.set(member.user.id, member.user));
        guild.channels.forEach((channel: any) => this.channels.set(channel.id, channel));
        if (this.guilds.every((g: any) => !g.unavailable) && !this.#ready) {
          this.#ready = true;
          this.emit('ready');
        }
      });

      newShard.on('channelCreate', (data: any) => {
        this.channels.set(data.id, data);
        if (data.guild_id) {
          let g = this.guilds.get(data.guild_id);
          g.channels[data.id] = data;
          this.guilds.set(g.id, g);
        }
        this.emit('channelCreate', data);
      });

      newShard.on('channelUpdate', (data: any) => {
        this.channels.set(data.id, data);
        if (data.guild_id) {
          let g = this.guilds.get(data.guild_id);
          g.channels[data.id] = data;
          this.guilds.set(g.id, g);
        }
        this.emit('channelCreate', data);
      });

      newShard.on('channelDelete', (data: any) => {
        this.channels.delete(data.id);
        if (data.guild_id) {
          let g = this.guilds.get(data.guild_id);
          delete g.channels[data.id];
          this.guilds.set(g.id, g);
        }
        this.emit('channelDelete', data);
      });

      newShard.on('channelPinsUpdate', (data: any) => {
        let c = this.channels.get(data.channel_id);
        if (c) c.lastPinnedTimestamp = new Date(data.last_pin_timestamp).getTime();
        if (data.guild_id) {
          if (c) this.guilds.get(data.guild_id).channels[data.channel_id] = c;
        }
        this.emit('channelPinsUpdate', data);
      });

      newShard.on('guildUpdate', (data: any) => {
        let guild = this.guilds.get(data.id);
        for (let key of Object.keys(data)) if (guild[key] !== data[key]) guild[key] = data[key];
        this.guilds.set(data.id, guild);
        this.emit('guildUpdate', data);
      });

      newShard.on('guildDelete', (data: any) => {
        let guild = this.guilds.get(data.id);
        this.guilds.delete(guild.id);
        this.emit('guildDelete', guild);
      });

      newShard.on('guildBanAdd', (data: any) => {
        this.emit('guildBanAdd', this.guilds.get(data.guild_id), data.user);
      });

      newShard.on('guildBanRemove', (data: any) => {
        this.emit('guildBanRemove', this.guilds.get(data.guild_id), data.user);
      });

      newShard.on('guildEmojisUpdate', (data: any) => {
        this.emit('guildEmojisUpdate', this.guilds.get(data.guild_id), data.emojis);
      });

      newShard.on('guildIntegrationsUpdate', (data: any) => {
        this.emit('guildIntegrationsUpdate', this.guilds.get(data.guild_id));
      });

      newShard.on('guildMemberAdd', (data: any) => {
        let member = data,
          guild = this.guilds.get(data.guild_id);
        delete member.guild_id;
        guild.members = guild.members.filter((m: any) => m.user.id !== member.user.id);
        guild.members.push(member);
        this.guilds.set(guild.id, guild);
        this.users.set(member.user.id, member.user);
        this.emit('guildMemberAdd', guild, member);
      });

      newShard.on('guildMemberRemove', (data: any) => {
        let guild = this.guilds.get(data.guild_id);
        guild.members = guild.members.filter((m: any) => m.user.id !== data.user.id);
        this.guilds.set(guild.id, guild);
        this.emit('guildMemberRemove', guild, data.user);
      });

      newShard.on('guildMemberUpdate', (data: any) => {
        let guild = this.guilds.get(data.guild_id);
        let member = guild.members.filter((m: any) => m.user.id === data.user.id)[0];
        let oldMember = member !== undefined ? { ...member } : {};
        for (let k of Object.keys(data)) if (member[k] && member[k] !== data[k]) member[k] = data[k];
        guild.members = guild.members.filter((m: any) => m.user.id !== member.user.id);
        guild.members.push(member);
        this.guilds.set(guild.id, guild);
        this.users.set(member.user.id, member.user);
        this.emit('guildMemberUpdate', guild, oldMember, member);
      });

      newShard.on('guildMembersChunk', (data: any) => {
        let guild = this.guilds.get(data.guild_id);
        guild.members.filter((m: any) => !data.members.map((x: any) => x.user.id).includes(m.user.id));
        guild.members.push(...data.members);
        data.members.map((x: any) => {
          x.user.presence = guild.presences.find((p: any) => p.user.id === x.user.id);
          return x;
        });
        data.members.forEach((member: any) => this.users.set(member.user.id, member.user));
        this.guilds.set(guild.id, guild);
      });

      newShard.on('guildRoleCreate', (data: any) => {
        let guild = this.guilds.get(data.guild_id);
        guild.roles = guild.roles.filter((r: any) => r.id !== data.role.id);
        guild.roles.push(data.role);
        this.emit('guildRoleCreate', guild, data.role);
      });

      newShard.on('guildRoleUpdate', (data: any) => {
        let guild = this.guilds.get(data.guild_id);
        let role = guild.roles.filter((r: any) => r.id === data.role.id)[0];
        guild.roles = guild.roles.filter((r: any) => r.id !== data.role.id);
        guild.roles.push(data.role);
        this.emit('guildRoleUpdate', guild, role, data.role);
      });

      newShard.on('guildRoleDelete', (data: any) => {
        let guild = this.guilds.get(data.guild_id);
        let role = guild.roles.filter((r: any) => r.id === data.role.id)[0];
        guild.roles = guild.roles.filter((r: any) => r.id !== data.role.id);
        this.emit('guildRoleDelete', guild, role);
      });

      newShard.on('inviteCreate', (data: any) => {
        this.emit('inviteCreate', this.guilds.get(data.guild_id), data);
      });

      newShard.on('inviteDelete', (data: any) => {
        this.emit('inviteDelete', this.guilds.get(data.guild_id), data);
      });

      newShard.on('messageCreate', (data: any) => {
        this.messages.set(data.id, data);
        let channel = this.channels.get(data.channel_id);
        channel.last_message_id = data.id;
        if (data.guild_id) {
          let g = this.guilds.get(data.guild_id);
          g.channels = g.channels.filter((c: any) => c.id !== channel.id);
          g.channels.push(channel);
          this.guilds.set(g.id, g);
        }
        this.emit('message', data);
      });

      newShard.on('messageUpdate', (data: any) => {
        let oldMessage = this.messages.get(data.id);
        let newMessage = oldMessage !== undefined ? { ...oldMessage } : {};
        for (let k of Object.keys(data)) newMessage[k] = data[k];
        this.emit('messageUpdate', oldMessage, newMessage);
      });

      newShard.on('messageDelete', (data: any) => {
        this.emit('messageDelete', this.messages.get(data.id) || data);
      });

      newShard.on('messageDeleteBulk', (data: any) => {
        let deleted = new Collection();
        data.ids.forEach((id: string) => deleted.set(id, this.messages.get(id)));
        this.emit('messageDeleteBulk', deleted, this.channels.get(data.channel_id));
      });

      newShard.on('messageReactionAdd', (data: any) => {
        this.emit('messageReactionAdd', {
          user: this.users.get(data.user_id) || { id: data.user_id },
          channel: this.channels.get(data.channel_id) || { id: data.channel_id },
          message: this.messages.get(data.message_id) || { id: data.message_id },
          emoji: data.emoji,
          guild: data.guild_id !== undefined ? this.guilds.get(data.guild_id) || { id: data.guild_id } : undefined,
          member: data.member
        });
      });

      newShard.on('messageReactionRemove', (data: any) => {
        this.emit('messageReactionRemove', {
          user: this.users.get(data.user_id) || { id: data.user_id },
          channel: this.channels.get(data.channel_id) || { id: data.channel_id },
          message: this.messages.get(data.message_id) || { id: data.message_id },
          emoji: data.emoji,
          guild: data.guild_id !== undefined ? this.guilds.get(data.guild_id) || { id: data.guild_id } : undefined
        });
      });

      newShard.on('messageReactionRemoveAll', (data: any) => {
        this.emit('messageReactionRemoveAll', {
          channel: this.channels.get(data.channel_id) || { id: data.channel_id },
          message: this.messages.get(data.message_id) || { id: data.message_id },
          guild: data.guild_id !== undefined ? this.guilds.get(data.guild_id) || { id: data.guild_id } : undefined
        });
      });

      newShard.on('messageReactionRemoveEmoji', (data: any) => {
        this.emit('messageReactionRemoveEmoji', {
          channel: this.channels.get(data.channel_id) || { id: data.channel_id },
          message: this.messages.get(data.message_id) || { id: data.message_id },
          guild: data.guild_id !== undefined ? this.guilds.get(data.guild_id) || { id: data.guild_id } : undefined,
          emoji: data.emoji
        });
      });

      newShard.on('presenceUpdate', (data: any) => {
        let guild = this.guilds.get(data.guild_id);
        let member = {
          user: this.users.get(data.user.id) || {},
          roles: guild.roles.filter((r: any) => data.roles.includes(r.id)),
          presence: {
            game: data.game,
            activities: data.activities,
            client: data.client_status,
            status: data.status
          },
          guild,
          nickname: data.nick,
          premiumSince: data.premium_since
        };
        for (let k of Object.keys(data.user)) if (data.user[k] !== member.user[k]) member.user[k] = data.user[k];
        this.users.set(member.user.id, member.user);

        this.emit('presenceUpdate', member);
      });

      newShard.on('typingStart', (data: any) => {
        let user = this.users.get(data.user_id) || { id: data.user_id };
        let channel = this.channels.get(data.channel_id) || { id: data.channel_id };
        let guild = undefined;
        let member = undefined;
        if (data.guild_id) {
          guild = this.guilds.get(data.guild_id) || { id: data.guild_id };
          member = data.member;
        }
        this.emit('typingStart', member || user, channel, guild);
      });

      newShard.on('userUpdate', (data: any) => {
        this.#user = new ClientUser(this, data, this.user.presence);
        this.emit('userUpdate', this.user);
      });

      newShard.on('voiceStateUpdate', (data: any) => {
        this.emit('voiceStateUpdate', data);
      });

      newShard.on('voiceServerUpdate', (data: any) => {
        this.emit('voiceServerUpdate', data);
      });

      newShard.on('webhooksUpdate', (data: any) => {
        this.emit('webhooksUpdate', {
          channel: this.channels.get(data.channel_id) || { id: data.channel_id },
          guild: this.guilds.get(data.guild_id) || { id: data.guild_id }
        });
      });

      this.shardManager.set(shardId, newShard);
    }, 5000 * shardId);
  }

  /* Audit Logs */

  /**
   * Fetches Audit Logs for the specified guild. The bot must have VIEW_AUDIT_LOGS permission.
   * @param guildId The ID of the guild whose logs are to be fetched.
   */
  async getAuditLogs(guildId: string) {
    try {
      let audit = await this.http.get(`/guilds/${guildId}/audit-logs`);
      return audit.body;
    } catch (e) {
      throw Error(`Error requesting audit logs for guild ID '${guildId}'.\n${e}.`).stack;
    }
  }

  /* Invites */

  /**
   * Get information regarding an invite code.
   * @param code The invite code whose information is to be fetched.
   */
  async getInviteInfo(code: string) {
    try {
      let invite = await this.http.get(`/invites/${code}?with_counts=true`);
      return invite.body;
    } catch (e) {
      throw Error(`Error requesting invite info for invite code '${code}'.\n${e}.`).stack;
    }
  }

  /**
   * Delete a discord invite.
   * @param code The invite code which is to be deleted.
   */
  async deleteInvite(code: string) {
    try {
      let invite = await this.http.delete(`/invites/${code}`);
      return invite.body;
    } catch (e) {
      throw Error(`Error deleting invite for invite code '${code}'.\n${e}.`).stack;
    }
  }


  /* Webhooks */

  /**
   * Get webhooks that belong to a specific channel.
   * @param channelId The ID of the channel whose webhooks are to be fetched.
   */
  async getChannelWebhooks(channelId: string) {
    try {
      let webhooks = await this.http.get(`/channels/${channelId}/webhooks`);
      return webhooks.body;
    } catch (e) {
      throw Error(`Error requesting webhooks for channel ID '${channelId}'.\n${e}.`).stack;
    }
  }

  /**
   * Get webhooks that belong to a specific guild.
   * @param guildId The ID of the guild whose webhooks are to be fetched.
   */
  async getGuildWebhooks(guildId: string) {
    try {
      let webhooks = await this.http.get(`/guilds/${guildId}/webhooks`);
      return webhooks.body;
    } catch (e) {
      throw Error(`Error requesting webhooks for guild ID '${guildId}'.\n${e}.`).stack;
    }
  }

  /**
   * Get a webhook by it's ID
   * @param webhookId The webhook's ID.
   */
  async getWebhook(webhookId: string) {
    try {
      let webhooks = await this.http.get(`/webhooks/${webhookId}`);
      return webhooks.body;
    } catch (e) {
      throw Error(`Error requesting webhook by ID '${webhookId}'.\n${e}.`).stack;
    }
  }

  /**
   * Modifies a specified webhook's settings.
   * @param webhookId The ID of the webhook that needs to be edited.
   * @param data The new settings.
   */
  async modifyWebhook(webhookId: string, data: { name?: string; imageData?: string; channelId?: string }) {
    try {
      let webhooks = await this.http.patch(`/webhooks/${webhookId}`, {
        body: JSON.stringify(data)
      });
      return webhooks.body;
    } catch (e) {
      throw Error(`Error modifying webhook by ID '${webhookId}'.\n${e}.`).stack;
    }
  }

  /**
   * Delete an existing webhook by it's ID.
   * @param webhookId The ID of the webhook that needs to be deleted.
   */
  async deleteWebhook(webhookId: string) {
    try {
      let webhooks = await this.http.delete(`/webhooks/${webhookId}`);
      return webhooks.body || {};
    } catch (e) {
      throw Error(`Error deleting webhook by ID '${webhookId}'.\n${e}.`).stack;
    }
  }

  /**
   * Executes a webhook/sends a message from the webhook.
   * @param webhookId The ID of the webhook that needs to be executed.
   * @param webhookToken The token of the webhook that needs to be executed.
   * @param data The message data that needs to be sent.
   */
  async executeWebhook(
    webhookId: string,
    webhookToken: string,
    data: {
      content?: string;
      username?: string;
      avatar?: string;
      tts?: boolean;
      file?: {
        name: string;
        content: Blob;
      };
      embeds?: any[];
      allowMentions?: boolean;
    }
  ) {
    let formData = new FormData();
    let headers = new Headers();

    let jsonData = {
      content: data.content,
      username: data.username,
      avatar_url: data.avatar,
      tts: data.tts,
      embeds: data.embeds,
      allowed_mentions: data.allowMentions ? { parse: ['users', 'roles', 'everyone'] } : { parse: [] }
    };
    let payloadJson = JSON.stringify(jsonData);
    formData.append('payload_json', payloadJson);
    if (data.file) {
      formData.append('file', data.file.content, data.file.name);
      headers.append('content-disposition', `form-data;name="file";filename="${data.file.name}";`);
    }
    try {
      let message = await this.http.post(`/webhooks/${webhookId}/${webhookToken}`, {
        headers,
        body: formData
      });
      return message.body;
    } catch (e) {
      throw Error(`Error executing webhook '${webhookId}'.\n${e}.`).stack;
    }
  }
}

export default Client;
