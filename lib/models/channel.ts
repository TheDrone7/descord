import { List } from '../util/util.ts';
import Client from '../client.ts';
import { ChannelData, Overwrite } from '../types/modelData.ts';
import User from './user.ts';

export class Channel {
  readonly client: Client;
  id: string;
  type: 'TEXT'|'DM'|'VOICE'|'GROUP'|'CATEGORY'|'NEWS'|'STORE';
  constructor(client: Client, channelData: ChannelData) {
    this.client = client;
    this.id = channelData.id;
    this.type = (['TEXT','DM','VOICE','GROUP','CATEGORY','NEWS','STORE'] as const)[channelData.type];
  }

  get createdTimestamp() { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
  get createdAt() { return new Date(this.createdTimestamp); }
}

export class TextChannel extends Channel {
  guildId: string;
  position: number;
  name: string;
  permissionOverwrites: Overwrite[];
  rateLimitPerUser: number;
  nsfw: boolean;
  topic: string;
  lastMessageId: string|null;
  lastPinAt: Date|null;
  parentId: string|null;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.guildId = channelData.guild_id!;
    this.position = channelData.position || 0;
    this.name = channelData.name || '';
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.parentId = channelData.parent_id || null;
    this.rateLimitPerUser = channelData.rate_limit_per_user!;
    this.nsfw = channelData.nsfw || false;
    this.topic = channelData.topic || '';
    this.lastMessageId = channelData.last_message_id || null;
    this.lastPinAt = (typeof channelData.last_pin_timestamp === 'string') ? new Date(channelData.last_pin_timestamp) : null;
  }
  get guild() {
    return this.client.guilds.get(this.guildId);
  }
}

export class NewsChannel extends TextChannel {
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
  }
}

export class VoiceChannel extends Channel {
  guildId: string;
  position: number;
  name: string;
  permissionOverwrites: Overwrite[];
  parentId: string|null;
  nsfw: boolean;
  bitrate: number;
  userLimit: number;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.guildId = channelData.guild_id!;
    this.position = channelData.position || 0;
    this.name = channelData.name || '';
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.parentId = channelData.parent_id || null;
    this.nsfw = channelData.nsfw || false;
    this.bitrate = channelData.bitrate || 64000;
    this.userLimit = channelData.user_limit || 0;
  }

  get guild() {
    return this.client.guilds.get(this.guildId);
  }
}

export class DMChannel extends Channel {
  lastMessageId: string|null;
  recipients: List<string, User>;
  lastPinAt: Date|null;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.lastMessageId = channelData.last_message_id || null;
    this.recipients = new List(...channelData.recipients!.map(u => new User(client, u)));
    this.lastPinAt = (typeof channelData.last_pin_timestamp === 'string') ? new Date(channelData.last_pin_timestamp) : null;
  }
}

export class GroupDMChannel extends Channel {
  name: string;
  recipients: List<string, User>;
  lastMessageId: string|null;
  lastPinAt: Date|null;
  ownerId: string;
  owner: User;
  applicationId: string|null;
  icon: string|null;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.name = channelData.name || '';
    this.icon = channelData.icon || null;
    this.recipients = new List(...channelData.recipients!.map(u => new User(client, u)));
    this.lastMessageId = channelData.last_message_id || null;
    this.lastPinAt = (typeof channelData.last_pin_timestamp === 'string') ? new Date(channelData.last_pin_timestamp) : null;
    this.ownerId = channelData.owner_id!;
    this.applicationId = channelData.application_id || null;
    this.owner = this.recipients.get(this.ownerId);
  }
}

export class ChannelCategory extends Channel {
  name: string;
  permissionOverwrites: Overwrite[];
  parentId: string|null;
  nsfw: boolean;
  position: number;
  guildId: string;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.name = channelData.name || '';
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.parentId = channelData.parent_id || null;
    this.nsfw = channelData.nsfw || false;
    this.position = channelData.position || 0;
    this.guildId = channelData.guild_id!;
  }

  get guild() {
    return this.client.guilds.get(this.guildId);
  }
}

export class GuildStore extends Channel {
  guildId: string;
  name: string;
  position: number;
  permissionOverwrites: Overwrite[];
  nsfw: boolean;
  parentId: string|null;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.guildId = channelData.guild_id!;
    this.name = channelData.name || '';
    this.position = channelData.position || 0;
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.nsfw = channelData.nsfw || false;
    this.parentId = channelData.parent_id || null;
  }

  get guild() {
    return this.client.guilds.get(this.guildId);
  }
}

export class GuildChannels extends List<string, Channel> {
  client: Client;
  constructor(client: Client, ...channels: ChannelData[]) {
    let channelObjects = channels.map(c => {
      switch(c.type) {
        case 2:
          return new VoiceChannel(client, c);
        case 4:
          return new ChannelCategory(client, c);
        case 5:
          return new NewsChannel(client, c);
        case 6:
          return new GuildStore(client, c);
        default:
          return new TextChannel(client, c);
      }
    });
    super(...channelObjects);
    this.client = client;
  }

}