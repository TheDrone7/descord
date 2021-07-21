import { ActivityType, PresenceStatus } from '../data.ts';
import { UserData } from './user.ts';

export interface Presence {
  user: UserData
  since?: number | null;
  activities?: Activity[] | null;
  status: PresenceStatus;
  afk?: boolean;
}

export interface Activity {
  name: string;
  type: ActivityType;
  url?: string;
  created_at?: number;
  timestamps?: { start?: number, end?: number };
  application_id?: string;
  details?: string | null;
  state?: string | null;
  emoji?: { name: string, id?: string, animated?: boolean } | null;
  party?: { id?: string, size?: [number, number] };
  assets?: { large_image?: string, large_text?: string, small_image?: string, small_text?: string };
  secrets?: { join?: string, spectate?: string, match?: string };
  instance?: boolean;
  flags?: number;
}

export interface PresenceUpdate {
  user: UserData;
  guild_id: string;
  status: PresenceStatus;
  activities: Activity[];
  client_status: {
    desktop?: PresenceStatus;
    mobile?: PresenceStatus;
    web?: PresenceStatus;
  };
}