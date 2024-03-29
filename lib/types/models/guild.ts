import { RoleData } from './role.ts';
import { EmojiData } from './emoji.ts';
import { VoiceStateData } from './voice.ts';
import { GuildMemberData } from './member.ts';
import { ChannelData } from './channel.ts';
import { PresenceUpdate } from './presence.ts';
import { StageInstanceData } from './stageInstance.ts';
import { StickerData } from './sticker.ts';
import { UserData } from './user.ts';

export enum DefaultMessageNotificationLevel {'ALL_MESSAGES', 'ONLY_MENTIONS'}
export enum ExplicitContentFilterLevel {'DISABLED', 'MEMBER_WITHOUT_ROLES', 'ALL_MEMBERS'}
export enum MFALevel {'NONE', 'ELEVATED'}
export enum VerificationLevel { 'NONE', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'}
export enum GuildNSFWLevel { 'DEFAULT', 'EXPLICIT', 'SAFE', 'AGE_RESTRICTED'}
export enum PremiumTier { 'NONE', 'TIER_1', 'TIER_2', 'TIER_3'}
export enum EventPrivacyLevel { 'GUILD_ONLY' = 2 }
export enum EventStatus { 'SCHEDULED' = 1, 'ACTIVE', 'COMPLETED', 'CANCELED' }
export enum EventEntityType { 'STAGE_INSTANCE' = 1, 'VOICE', 'EXTERNAL' }

export interface WelcomeScreenChannels {
  channel_id: string;
  description: string;
  emoji_id: string|null;
  emoji_name: string|null;
}

export interface WelcomeScreenData {
  description: string|null;
  welcome_channels?: WelcomeScreenChannels[];
}

export interface EventEntityMetadata {
  location?: string;
}

export interface GuildScheduledEventData {
  id: string;
  guild_id: string;
  channel_id: string|null;
  creator_id: string|null;
  name: string;
  description?: string;
  scheduled_start_time: string;
  scheduled_end_time: string|null;
  privacy_level: EventPrivacyLevel;
  status: EventStatus;
  entity_type: EventEntityType;
  entity_id: string|null;
  entity_metadata: EventEntityMetadata|null;
  creator?: UserData;
  user_count?: number
}

export interface GuildData {
  id: string;
  unavailable?: boolean;
  name?: string;
  icon?: string|null;
  splash?: string|null;
  discovery_splash?: string|null;
  owner_id?: string;
  afk_channel_id?: string|null;
  afk_timeout?: number;
  widget_enabled?: boolean;
  widget_channel_id?: string|null;
  verification_level?: VerificationLevel;
  default_message_notifications?: DefaultMessageNotificationLevel;
  explicit_content_filter?: ExplicitContentFilterLevel;
  roles?: RoleData[];
  emojis?: EmojiData[];
  features?: ('ANIMATED_ICON' | 'BANNER' | 'COMMERCE' | 'COMMUNITY' | 'DISCOVERABLE' | 'FEATURABLE' | 'INVITE_SPLASH' | 'MEMBER_VERIFICATION_GATE_ENABLED' | 'NEWS' | 'PARTNERED' | 'PREVIEW_ENABLED' | 'VANITY_URL' | 'VERIFIED' | 'VIP_REGIONS' | 'WELCOME_SCREEN_ENABLED' | 'TICKETED_EVENTS_ENABLED' | 'MONETIZATION_ENABLED' | 'MORE_STICKERS' | 'THREE_DAY_THREAD_ARCHIVE' | 'SEVEN_DAY_THREAD_ARCHIVE' | 'PRIVATE_THREADS')[];
  mfa_level?: MFALevel;
  application_id?: string|null;
  system_channel_id?: string|null;
  system_channel_flags?: number;
  rules_channel_id?: string|null;
  joined_at?: string;
  large?: boolean;
  member_count?: number;
  voice_states?: VoiceStateData[];
  members?: GuildMemberData[];
  channels?: ChannelData[];
  threads?: ChannelData[];
  presences?: PresenceUpdate[];
  max_presences?: number|null;
  max_members?: number;
  vanity_url_code?: string|null;
  description?: string|null;
  banner?: string|null;
  premium_tier?: PremiumTier;
  premium_subscription_count?: number;
  preferred_locale?: string;
  public_updates_channel_id?: string|null;
  max_video_channel_users?: number;
  approximate_member_count?:   number;
  approximate_presence_count?: number;
  welcome_screen?: WelcomeScreenData;
  nsfw_level?: GuildNSFWLevel;
  stage_instances?: StageInstanceData[];
  stickers?: StickerData[];
  guild_scheduled_events?: GuildScheduledEventData[];
  premium_progress_bar_enabled: boolean;
}