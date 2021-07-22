import { List } from '../util/util.ts';
import Client from '../client.ts';
import { EmojiData } from '../types/index.ts';
import { GuildRoles, Role } from './role.ts';
import { User } from './user.ts';

export class Emoji {
  client: Client;
  name: string|null;
  id: string|null;
  roleIds: string[];
  user: User | null;
  requireColons: boolean;
  available: boolean;
  animated: boolean;
  managed: boolean;
  private readonly guildId: string;

  constructor(client: Client, guildId: string, emojiData: EmojiData) {
    this.client = client;
    this.id = emojiData.id;
    this.name = emojiData.name;
    this.guildId = guildId;
    this.roleIds = emojiData.roles || [];
    this.user = emojiData.user ? new User(client, emojiData.user) : null;
    this.requireColons = emojiData.require_colons || true;
    this.managed = emojiData.managed || false;
    this.animated = emojiData.animated || false;
    this.available = emojiData.available || true;
  }

  get guild() {
    return this.client.guilds.get(this.guildId);
  }

  get roles() {
    return this.client.guilds.get(this.guildId).roles.filter((r: Role) => (this.roleIds || []).includes(r.id))
  }
}

export class GuildEmojis extends List<string, Emoji> {
  client: Client;

  constructor(client: Client, guildId: string, ...emojis: EmojiData[]) {
    super(...emojis.map(e => new Emoji(client, guildId, e)));
    this.client = client;
  }
}