import { UserData } from './user.ts';

export interface GuildMemberData {
  user?: UserData;
  nick?: string | null;
  roles: string[];
  joined_at: string;
  premium_since: string | null;
  deaf: boolean;
  mute: boolean;
  pending?: boolean;
  permissions?: string;
}