import { ChannelData, ChannelOverwrite, ChannelType } from '../types/index.ts';
import Client from '../client.ts';
import { List } from '../util/util.ts';
import { User } from './user.ts';
import { ClientUser } from './clientUser.ts';
import { Guild } from './guild.ts';
import { Message } from './message.ts';
import { Member, ThreadMember } from './member.ts';

export class Channel {
  readonly client: Client;
  id: string;
  type: string;
  constructor(client: Client, channelData: ChannelData) {
    this.client = client;
    this.id = channelData.id;
    this.type = ChannelType[channelData.type];
  }

  get createdTimestamp(): number { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
  get createdAt(): Date { return new Date(this.createdTimestamp); }
}

export class TextChannel extends Channel {
  guildID: string;
  position: number;
  name: string;
  permissionOverwrites: ChannelOverwrite[];
  rateLimitPerUser: number;
  nsfw: boolean;
  topic: string;
  lastMessageID?: string;
  lastPinAt?: Date;
  parentID?: string;
  defaultAutoArchiveDuration: number;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.guildID = channelData.guild_id!;
    this.position = channelData.position || 0;
    this.name = channelData.name || '';
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.parentID = channelData.parent_id || undefined;
    this.rateLimitPerUser = channelData.rate_limit_per_user!;
    this.nsfw = channelData.nsfw || false;
    this.topic = channelData.topic || '';
    this.lastMessageID = channelData.last_message_id || undefined;
    this.defaultAutoArchiveDuration = channelData.default_auto_archive_duration || 60;
    this.lastPinAt = channelData.last_pin_timestamp ? new Date(channelData.last_pin_timestamp) : undefined;
  }
  get guild(): Guild {
    return this.client.guilds.get(this.guildID);
  }
  get lastMessage(): Message|undefined {
    return this.lastMessageID ? this.client.messages.get(this.lastMessageID) : undefined;
  }
  get lastPinTimestamp(): number|undefined {
    return this.lastPinAt ? this.lastPinAt.getTime() : undefined;
  }
  get parent(): Channel|undefined {
    return this.parentID ? this.guild.channels?.get(this.parentID) : undefined;
  }
}

export class NewsChannel extends TextChannel {
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
  }
}

export class VoiceChannel extends Channel {
  guildID: string;
  position: number;
  name: string;
  permissionOverwrites: ChannelOverwrite[];
  parentID?: string;
  nsfw: boolean;
  bitrate: number;
  userLimit: number;
  rtcRegion?: string;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.guildID = channelData.guild_id!;
    this.position = channelData.position || 0;
    this.name = channelData.name || '';
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.parentID = channelData.parent_id || undefined;
    this.nsfw = channelData.nsfw || false;
    this.bitrate = channelData.bitrate || 64000;
    this.userLimit = channelData.user_limit || 0;
    this.rtcRegion = channelData.rtc_region || undefined;
  }

  get guild(): Guild {
    return this.client.guilds.get(this.guildID);
  }
  get parent(): Channel {
    return this.parentID ? this.guild.channels?.get(this.parentID) : undefined;
  }
}

export class DMChannel extends Channel {
  lastMessageID?: string;
  recipients: List<string, User>;
  lastPinAt?: Date;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.lastMessageID = channelData.last_message_id || undefined;
    this.recipients = new List(...channelData.recipients!.map(u => new User(client, u)));
    this.lastPinAt = channelData.last_pin_timestamp ? new Date(channelData.last_pin_timestamp) : undefined;
  }

  get lastMessage() {
    return this.lastMessageID ? this.client.messages.get(this.lastMessageID) : undefined;
  }
  get lastPinTimestamp() {
    return this.lastPinAt ? this.lastPinAt.getTime() : undefined;
  }
}

export class GroupDMChannel extends Channel {
  name: string;
  recipients: List<string, User>;
  lastMessageID?: string;
  lastPinAt?: Date;
  ownerID: string;
  applicationID?: string;
  icon?: string;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.name = channelData.name || '';
    this.icon = (typeof channelData.icon === 'string') ? channelData.icon : undefined;
    this.recipients = new List(...channelData.recipients!.map(u => new User(client, u)));
    this.lastMessageID = channelData.last_message_id || undefined;
    this.lastPinAt = channelData.last_pin_timestamp ? new Date(channelData.last_pin_timestamp) : undefined;
    this.ownerID = channelData.owner_id!;
    this.applicationID = channelData.application_id;
  }

  get owner(): User {
    return this.recipients.get(this.ownerID);
  }
  get lastMessage(): Message|undefined {
    return this.lastMessageID ? this.client.messages.get(this.lastMessageID) : undefined;
  }
  get lastPinTimestamp(): number|undefined {
    return this.lastPinAt ? this.lastPinAt.getTime() : undefined;
  }
}

export class ChannelCategory extends Channel {
  name: string;
  permissionOverwrites: ChannelOverwrite[];
  parentID?: string;
  nsfw: boolean;
  position: number;
  guildID: string;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.name = channelData.name || '';
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.parentID = channelData.parent_id || undefined;
    this.nsfw = channelData.nsfw || false;
    this.position = channelData.position || 0;
    this.guildID = channelData.guild_id!;
  }

  get guild(): Guild {
    return this.client.guilds.get(this.guildID);
  }
  get parent(): Channel|undefined {
    return this.parentID ? this.guild.channels?.get(this.parentID) : undefined;
  }
}

export class GuildStore extends Channel {
  guildID: string;
  name: string;
  position: number;
  permissionOverwrites: ChannelOverwrite[];
  nsfw: boolean;
  parentID?: string;
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.guildID = channelData.guild_id!;
    this.name = channelData.name || '';
    this.position = channelData.position || 0;
    this.permissionOverwrites = channelData.permission_overwrites || [];
    this.nsfw = channelData.nsfw || false;
    this.parentID = channelData.parent_id || undefined;
  }

  get guild(): Guild {
    return this.client.guilds.get(this.guildID);
  }
  get parent(): Channel|undefined {
    return this.parentID ? this.guild.channels?.get(this.parentID) : undefined;
  }
}

export class Thread extends Channel {
  guildID: string;
  name: string;
  lastMessageID?: string;
  lastPinAt?: Date;
  rateLimitPerUser: number;
  ownerID: string;
  parentID: string;
  messageCount: number;
  memberCount: number;
  archived: boolean;
  autoArchiveDuration: number;
  archivedAt?: Date;
  locked?: boolean;
  members: List<string, ThreadMember>
  me?: { user: ClientUser; joinedAt: Date; flags: number; };

  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.name = channelData.name!;
    this.guildID = channelData.guild_id!;
    this.lastMessageID = channelData.last_message_id || undefined;
    this.lastPinAt = channelData.last_pin_timestamp ? new Date(channelData.last_pin_timestamp) : undefined;
    this.rateLimitPerUser = channelData.rate_limit_per_user || 0;
    this.ownerID = channelData.owner_id!;
    this.parentID = channelData.parent_id!;
    this.messageCount = channelData.message_count!;
    this.memberCount = channelData.member_count!;
    this.archived = channelData.thread_metadata!.archived;
    this.autoArchiveDuration = channelData.thread_metadata!.auto_archive_duration;
    this.archivedAt = channelData.thread_metadata?.archive_timestamp ? new Date(channelData.thread_metadata!.archive_timestamp) : undefined;
    this.locked = channelData.thread_metadata?.locked;
    this.members = new List()

    if (channelData.member && channelData.member.user_id === client.user!.id)
      this.me = { user: client.user!, joinedAt: new Date(channelData.member.join_timestamp), flags: channelData.member.flags };
  }

  get guild(): Guild {
    return this.client.guilds.get(this.guildID);
  }
  get lastMessage(): Message|undefined {
    return this.lastMessageID ? this.client.messages.get(this.lastMessageID) : undefined;
  }
  get lastPinTimestamp(): number|undefined {
    return this.lastPinAt ? this.lastPinAt.getTime() : undefined;
  }
  get parent(): Channel|undefined {
    return this.parentID ? this.guild.channels?.get(this.parentID) : undefined;
  }
  get owner(): ThreadMember|Member|undefined {
    return this.members.has(this.ownerID) ? this.members.get(this.ownerID) : this.guild.members?.get(this.ownerID);
  }
}

class StageChannel extends VoiceChannel {
  topic?: string
  constructor(client: Client, channelData: ChannelData) {
    super(client, channelData);
    this.topic = channelData.topic || undefined;
  }
}

export const newChannel = (client: Client, c: ChannelData): Channel => {
  switch(c.type) {
    case 2:
      return new VoiceChannel(client, c);
    case 13:
      return new StageChannel(client, c);
    case 4:
      return new ChannelCategory(client, c);
    case 5:
      return new NewsChannel(client, c);
    case 6:
      return new GuildStore(client, c);
    case 10:
    case 11:
    case 12:
      return new Thread(client, c);
    default:
      return new TextChannel(client, c);
  }
}

export class GuildChannels extends List<string, Channel> {
  client: Client;
  constructor(client: Client, ...channels: ChannelData[]) {
    let channelObjects = channels.map(c => newChannel(client, c));
    super(...channelObjects);
    this.client = client;
  }
}