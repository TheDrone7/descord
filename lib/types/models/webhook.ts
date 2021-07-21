import { UserData } from './user.ts';
import { GuildData } from './guild.ts';
import { ChannelData } from './channel.ts';

export enum WebhookType {
  'Incoming' = 1,
  'Channel Follower',
  'Application'
}

export interface WebhookData {
  id: string;
  type: number;
  guild_id?: string;
  channel_id: string;
  user?: UserData;
  name: string|null;
  avatar: string|null;
  token?: string;
  application_id: string|null;
  source_guild?: GuildData;
  source_channel?: ChannelData;
}