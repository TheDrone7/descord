import { UserData } from './user.ts';
import { GuildData } from './guild.ts';

export interface GuildTemplateData {
  code: string;
  name: string;
  description: string|null;
  usage_count: number;
  creator_id: string;
  creator: UserData;
  created_at: string;
  updated_at: string;
  source_guild_id: string;
  serialized_source_guild: GuildData;
  is_dirty: boolean|null;
}