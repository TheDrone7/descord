import { UserData } from './user.ts';

export enum ChannelType {
  'GUILD_TEXT',
  'DM',
  'GUILD_VOICE',
  'GROUP_DM',
  'GUILD_CATEGORY',
  'GUILD_NEWS',
  'GUILD_STORE',
  'GUILD_NEWS_THREAD' = 10,
  'GUILD_PUBLIC_THREAD',
  'GUILD_PRIVATE_THREAD',
  'GUILD_STAGE_VOICE'
}
export enum VideoQualityMode { 'AUTO' = 1, 'FULL'}

export interface ThreadMetadataData {
  archived: boolean;
  auto_archive_duration: number;
  archive_timestamp: string;
  locked?: boolean;
}

export interface ThreadMemberData {
  id?: string;
  user_id?: string;
  join_timestamp: string;
  flags: number;
}

export interface ChannelData {
  id: string;
  type: ChannelType;
  guild_id?: string;
  position?: number;
  permission_overwrites?: ChannelOverwrite[];
  name?: string;
  topic?: string | null;
  nsfw?: boolean;
  last_message_id?: string | null;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  recipients?: UserData[];
  icon?: string | null;
  owner_id?: string;
  application_id?: string;
  parent_id?: string | null;
  last_pin_timestamp?: string | null;
  rtc_region?: string|null;
  video_quality_mode?: VideoQualityMode;
  message_count?: number;
  member_count?: number;
  thread_metadata?: ThreadMetadataData;
  member?: ThreadMemberData;
  default_auto_archive_duration?: number;
  permissions?: string;
}

export interface ChannelOverwrite {
  id: string;
  type: 0 | 1;
  allow: string;
  deny: string;
}