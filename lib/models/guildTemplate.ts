import Client from '../client.ts';
import { GuildTemplateData } from '../types/index.ts';
import { User } from './user.ts';
import { Guild } from './guild.ts';

export class GuildTemplate {
  client: Client;
  code: string;
  name: string;
  description?: string;
  usageCount: number;
  creatorID: string;
  creator: User;
  createdAt: Date;
  updatedAt: Date;
  sourceGuildID: string;
  serializedSourceGuild: Guild;
  isDirty?: boolean;
  constructor(client: Client, data: GuildTemplateData) {
    this.client = client;
    this.code = data.code;
    this.name = data.name;
    this.description = data.description || undefined;
    this.usageCount = data.usage_count;
    this.creatorID = data.creator_id;
    this.creator = new User(client, data.creator);
    this.createdAt = new Date(data.created_at);
    this.updatedAt = new Date(data.updated_at);
    this.sourceGuildID = data.source_guild_id;
    this.serializedSourceGuild = new Guild(client, data.serialized_source_guild);
    this.isDirty = data.is_dirty || undefined;
  }

  get createdTimestamp() { return this.createdAt.getTime(); }
  get updatedTimestamp() { return this.updatedAt.getTime(); }
}