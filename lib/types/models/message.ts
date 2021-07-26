import { UserData } from './user.ts';
import { GuildMemberData } from './member.ts';
import { ApplicationData } from './application.ts';
import { ChannelData, ChannelType } from './channel.ts';
import { EmojiData } from './emoji.ts';
import { MessageComponentData } from './component.ts';
import { EmbedData } from './embed.ts';
import Client from '../../client.ts';

export type MessageFlag = 'CROSSPOSTED' | 'IS_CROSSPOST' | 'SUPPRESS_EMBEDS' | 'SOURCE_MESSAGE_DELETED' | 'URGENT' | 'HAS_THREAD' | 'EPHEMERAL' | 'LOADING';

export interface UserMentionData extends UserData {
  member: GuildMemberData;
}

export interface ChannelMentionData {
  id: string;
  guild_id: string;
  type: ChannelType;
  name: string;
}

export interface AttachmentData {
  id: string;
  filename: string;
  content_type?: string;
  size: number;
  url: string;
  proxy_url: string;
  height?: number|null;
  width?: number|null;
}

export interface MessageReactionData {
  count: number;
  me: boolean;
  emoji: EmojiData
}

export enum MessageActivityType {
  'JOIN' = 1,
  'SPECTATE',
  'LISTEN',
  'JOIN_REQUEST' = 5
}

export interface MessageActivityData {
  type: MessageActivityType;
  party_id?: string;
}

export interface MessageReferenceData {
  message_id?: string;
  channel_id?: string;
  guild_id?: string;
  fail_if_not_exists?: boolean;
}
export interface StickerData {}

export enum MessageType {
  'DEFAULT',
  'RECIPIENT_ADD',
  'RECIPIENT_REMOVE',
  'CALL',
  'CHANNEL_NAME_CHANGE',
  'CHANNEL_ICON_CHANGE',
  'CHANNEL_PINNED_MESSAGE',
  'GUILD_MEMBER_JOIN',
  'USER_PREMIUM_GUILD_SUBSCRIPTION',
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1',
  USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2,
  'USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3',
  'CHANNEL_FOLLOW_ADD',
  'GUILD_DISCOVERY_DISQUALIFIED' = 14,
  'GUILD_DISCOVERY_REQUALIFIED',
  'GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING',
  'GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING',
  'THREAD_CREATED',
  'REPLY',
  'APPLICATION_COMMAND',
  'THREAD_STARTER_MESSAGE',
  'GUILD_INVITE_REMINDER'
}

export enum StickerFormatType {
  PNG = 1,
  APNG,
  LOTTIE
}

export interface MessageStickerData {
  id: string;
  name: string;
  format_type: StickerFormatType;
}

export interface AllowedMentionsData {
  parse?: ('roles' | 'users' | 'everyone')[];
  users?: string[];
  roles?: string[];
  replied_user?: boolean;
}

export enum InteractionType {
  'PING'= 1,
  'APPLICATION COMMAND',
  'MESSAGE COMPONENT'
}

export interface MessageInteractionData {
  id: string;
  type: InteractionType;
  name: string;
  user: UserData;
}

export interface MessageData {
  id: string;
  channel_id: string;
  guild_id?: string;
  author: UserData;
  member?: GuildMemberData;
  content: string;
  timestamp: string;
  edited_timestamp: string|null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: UserMentionData[];
  mention_roles: string[];
  mention_channels: ChannelMentionData[];
  attachments: AttachmentData[];
  embeds: EmbedData[];
  reactions?: MessageReactionData[];
  nonce?: string|number;
  pinned: boolean;
  webhook_id?: string;
  type: MessageType;
  activity?: MessageActivityData;
  application?: ApplicationData;
  application_id?: string;
  message_reference?: MessageReferenceData;
  flags?: number;
  referenced_message?: MessageData|null;
  interaction?: MessageInteractionData;
  thread?: ChannelData;
  components?: MessageComponentData[];
  sticker_items?: MessageStickerData[];
}