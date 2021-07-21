import { GuildMemberData } from './member.ts';

export interface VoiceStateData {
  guild_id?: string;
  channel_id: string|null;
  user_id: string;
  member?: GuildMemberData;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_deaf: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  suppress: boolean;
  request_to_speak_timestamp: string|null;
}

export interface VoiceRegionData {
  id: string;
  name: string;
  vip: boolean;
  optimal: boolean;
  deprecated: boolean;
  custom: boolean;
}