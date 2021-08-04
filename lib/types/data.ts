export type Intent = 'GUILDS' | 'GUILD_MEMBERS' | 'GUILD_BANS' | 'GUILD_EMOJIS' | 'GUILD_INTEGRATIONS' | 'GUILD_WEBHOOKS' | 'GUILD_INVITES' | 'GUILD_VOICE_STATES' | 'GUILD_PRESENCES' | 'GUILD_MESSAGES' | 'GUILD_MESSAGE_REACTIONS' | 'GUILD_MESSAGE_TYPING' | 'DIRECT_MESSAGES' | 'DIRECT_MESSAGE_REACTIONS' | 'DIRECT_MESSAGE_TYPING';
export type ActivityType = 'PLAYING' | 'STREAMING' | 'LISTENING' | 'CUSTOM' | 'COMPETING';
export type PresenceStatus = 'ONLINE' | 'DND' | 'IDLE' | 'INVISIBLE' | 'OFFLINE';

export interface Hello { heartbeat_interval: number; }
export type Permission = 'CREATE INSTANT INVITE' | 'KICK MEMBERS' | 'BAN MEMBERS' | 'ADMINISTRATOR' | 'MANAGE CHANNELS' | 'MANAGE GUILD' | 'ADD REACTION' | 'VIEW AUDIT LOG' | 'PRIORITY SPEAKER' | 'STREAM' | 'VIEW CHANNEL' | 'SEND MESSAGES' | 'SEND TTS MESSAGES' | 'MANAGE MESSAGES' | 'EMBED LINKS' | 'ATTACH FILES' | 'READ MESSAGES HISTORY' | 'MENTION EVERYONE' | 'USE EXTERNAL EMOJIS' | 'VIEW GUILD INSIGHTS' | 'CONNECT' | 'SPEAK' | 'MUTE MEMBERS' | 'DEAFEN MEMBERS' | 'MOVE MEMBERS' | 'USE VAD' | 'CHANGE NICKNAME' | 'MANAGE NICKNAMES' | 'MANAGE ROLES' | 'MANAGE WEBHOOKS' | 'MANAGE EMOJIS' | 'USE SLASH COMMANDS' | 'REQUEST TO SPEAK' | 'MANAGE THREADS' | 'USE PUBLIC THREADS' | 'USE PRIVATE THREADS';

export const Permissions = {
  0x0000000001: 'CREATE INSTANT INVITE',
  0x0000000002: 'KICK MEMBERS',
  0x0000000004: 'BAN MEMBERS',
  0x0000000008: 'ADMINISTRATOR',
  0x0000000010: 'MANAGE CHANNELS',
  0x0000000020: 'MANAGE GUILD',
  0x0000000040: 'ADD REACTION',
  0x0000000080: 'VIEW AUDIT LOG',
  0x0000000100: 'PRIORITY SPEAKER',
  0x0000000200: 'STREAM',
  0x0000000400: 'VIEW CHANNEL',
  0x0000000800: 'SEND MESSAGES',
  0x0000001000: 'SEND TTS MESSAGES',
  0x0000002000: 'MANAGE MESSAGES',
  0x0000004000: 'EMBED LINKS',
  0x0000008000: 'ATTACH FILES',
  0x0000010000: 'READ MESSAGES HISTORY',
  0x0000020000: 'MENTION EVERYONE',
  0x0000040000: 'USE EXTERNAL EMOJIS',
  0x0000080000: 'VIEW GUILD INSIGHTS',
  0x0000100000: 'CONNECT',
  0x0000200000: 'SPEAK',
  0x0000400000: 'MUTE MEMBERS',
  0x0000800000: 'DEAFEN MEMBERS',
  0x0001000000: 'MOVE MEMBERS',
  0x0002000000: 'USE VAD',
  0x0004000000: 'CHANGE NICKNAME',
  0x0008000000: 'MANAGE NICKNAMES',
  0x0010000000: 'MANAGE ROLES',
  0x0020000000: 'MANAGE WEBHOOKS',
  0x0040000000: 'MANAGE EMOJIS',
  0x0080000000: 'USE SLASH COMMANDS',
  0x0100000000: 'REQUEST TO SPEAK',
  0x0400000000: 'MANAGE THREADS',
  0x0800000000: 'USE PUBLIC THREADS',
  0x1000000000: 'USE PRIVATE THREADS'
};

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

export interface ChannelPinsUpdateData {
  guild_id?: string;
  channel_id: string;
  last_pin_timestamp?: string|null;
}