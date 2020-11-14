import { UserData } from './types.ts';

export type Intent = 'GUILDS' | 'GUILD_MEMBERS' | 'GUILD_BANS' | 'GUILD_EMOJIS' | 'GUILD_INTEGRATIONS' | 'GUILD_WEBHOOKS' | 'GUILD_INVITES' | 'GUILD_VOICE_STATES' | 'GUILD_PRESENCES' | 'GUILD_MESSAGES' | 'GUILD_MESSAGE_REACTIONS' | 'GUILD_MESSAGE_TYPING' | 'DIRECT_MESSAGES' | 'DIRECT_MESSAGE_REACTIONS' | 'DIRECT_MESSAGE_TYPING';
export type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'CUSTOM' | 'COMPETING';
export type PresenceStatus = 'ONLINE' | 'DND' | 'IDLE' | 'INVISIBLE' | 'OFFLINE';

export interface Hello { heartbeat_interval: number; }

export interface ClientActivity {
    name: string;
    type: ActivityType;
    url?: string;
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

export interface ClientPresence {
    since?: number | null;
    activities?: ClientActivity[] | null;
    status: PresenceStatus;
    afk?: boolean;
}

export interface Presence {
    user: UserData
    since?: number | null;
  activities?: Activity[] | null;
  status: PresenceStatus;
  afk?: boolean;
}