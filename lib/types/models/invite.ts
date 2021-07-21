import { GuildData } from './guild.ts';
import { ChannelData } from './channel.ts';
import { UserData } from './user.ts';
import { ApplicationData } from './application.ts';
import { GuildMemberData } from './member.ts';

export enum InviteTargetType {
  'STREAM' = 1,
  'EMBEDDED_APPLICATION'
}

export interface InviteStageInstanceData {
  members: GuildMemberData[];
  participant_count: number;
  speaker_count: number;
  topic: string;
}

export interface InviteData {
  code: string;
  guild?: GuildData;
  channel: ChannelData;
  inviter?: UserData;
  target_type?: InviteTargetType;
  target_user?: UserData;
  target_application?: ApplicationData;
  approximate_presence_count?: number;
  approximate_member_count?: number;
  expires_at?: string|null;
  stage_instance?: InviteStageInstanceData;
  uses?: number;
  max_uses?: number;
  max_age?: number;
  temporary?: boolean;
  created_at?: string;
}