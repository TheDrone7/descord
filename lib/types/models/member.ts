import { UserData } from './user.ts';
import { PresenceUpdate } from './presence.ts';

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
  hoisted_role?: string;
}

export interface ThreadMemberData {
  user_id: string;
  presence: PresenceUpdate|null;
  member: GuildMemberData;
  join_timestamp: string;
  id: string;
  flags: number;
}