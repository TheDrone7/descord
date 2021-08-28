import { List } from '../util/util.ts';
import Client from '../client.ts';
import { EmojiData } from '../types/index.ts';
import { Role } from './role.ts';
import { User } from './user.ts';
import { Guild } from './guild.ts';

export class Emoji {
  client: Client;
  name?: string;
  id?: string;
  roleIds: string[];
  user?: User;
  requireColons: boolean;
  available: boolean;
  animated: boolean;
  managed: boolean;
  private readonly guildId?: string;

  constructor(client: Client, guildId: string|null, emojiData: EmojiData) {
    this.client = client;
    this.id = emojiData.id || undefined;
    this.name = emojiData.name || undefined;
    this.guildId = guildId || undefined;
    this.roleIds = emojiData.roles || [];
    this.user = emojiData.user ? new User(client, emojiData.user) : undefined;
    this.requireColons = emojiData.require_colons || true;
    this.managed = emojiData.managed || false;
    this.animated = emojiData.animated || false;
    this.available = emojiData.available || true;
  }

  get guild(): Guild|undefined {
    return this.guildId ? this.client.guilds.get(this.guildId) : undefined;
  }

  get roles(): List<string, Role>|undefined {
    return this.guild ? this.guild.roles!.filter((r: Role) => (this.roleIds || []).includes(r.id)) : undefined;
  }

  get url(): string|undefined {
    return this.id ? `${this.client.cdnBase}emojis/${this.id}.${this.animated ? 'gif' : 'png'}` : undefined;
  }
}

export class GuildEmojis extends List<string, Emoji> {
  client: Client;

  constructor(client: Client, guildId: string, ...emojis: EmojiData[]) {
    super(...emojis.map(e => new Emoji(client, guildId, e)));
    this.client = client;
  }
}