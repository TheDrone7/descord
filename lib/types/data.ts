export type Intent = 'GUILDS' | 'GUILD_MEMBERS' | 'GUILD_BANS' | 'GUILD_EMOJIS' | 'GUILD_INTEGRATIONS' | 'GUILD_WEBHOOKS' | 'GUILD_INVITES' | 'GUILD_VOICE_STATES' | 'GUILD_PRESENCES' | 'GUILD_MESSAGES' | 'GUILD_MESSAGE_REACTIONS' | 'GUILD_MESSAGE_TYPING' | 'DIRECT_MESSAGES' | 'DIRECT_MESSAGE_REACTIONS' | 'DIRECT_MESSAGE_TYPING';
export type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'CUSTOM' | 'COMPETING';
export type PresenceStatus = 'ONLINE' | 'DND' | 'IDLE' | 'INVISIBLE' | 'OFFLINE';

export interface Hello { heartbeat_interval: number; }

export interface ClientActivity {
  name: string;
  type: ActivityType;
  url?: string;
}

export interface ClientPresence {
  since?: number | null;
  activities?: ClientActivity[] | null;
  status: PresenceStatus;
  afk?: boolean;
}