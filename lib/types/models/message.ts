import { UserData } from './user.ts';
import { GuildMemberData } from './member.ts';
import { ApplicationData } from './application.ts';
import { ChannelData, ChannelType } from './channel.ts';
import { EmojiData } from './emoji.ts';

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

export interface EmbedFooterData {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedImageData {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedThumbnailData {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedVideoData {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedProviderData {
  name?: string;
  url?: string;
}

export interface EmbedAuthorData {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedFieldData {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedData {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooterData;
  image?: EmbedImageData;
  thumbnail?: EmbedThumbnailData;
  video?: EmbedVideoData;
  provider?: EmbedProviderData;
  author: EmbedAuthorData;
  fields: EmbedFieldData[];
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

export enum MessageComponentType {
  'Action Row' = 1,
  'Button',
  'Select Menu'
}

export enum ButtonStyle {
  'Primary' = 1,
  'Secondary',
  'Success',
  'Danger',
  'Link'
}

export interface SelectOptions {
  label: string;
  value: string;
  description?: string;
  emoji?: EmojiData;
  default?: boolean;
}

export interface MessageComponentData {
  type: MessageComponentType;
  custom_id?: string;
  disabled?: boolean;
  style?: ButtonStyle;
  label?: string;
  emoji?: EmojiData;
  url?: string;
  options?: SelectOptions[];
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  components?: MessageComponentData[];
}

export interface MessageInteractionData {
  tts?: boolean;
  content?: string;
  embeds?: EmbedData[];
  allowed_mentions?: AllowedMentionsData;
  flags: number;
  components: MessageComponentData[];
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
  thread: ChannelData;
  components: MessageComponentData[];
  sticker_items: MessageStickerData[];
}