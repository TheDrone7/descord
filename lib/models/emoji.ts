import { List } from '../util/util.ts';
import Client from '../client.ts';
import { EmojiData } from '../types/modelData.ts';
import { GuildRoles } from './role.ts';
import User from './user.ts';

export class Emoji {
  client: Client;
  name: string;
  id: string;
  roles: GuildRoles;
  user: User | null;
  requireColons: boolean;
  available: boolean;
  animated: boolean;
  managed: boolean;

  constructor(client: Client, emojiData: EmojiData) {
    this.client = client;
    this.id = emojiData.id;
    this.name = emojiData.name;
    this.roles = new GuildRoles(...(emojiData.roles || []));
    this.user = emojiData.user ? new User(client, emojiData.user) : null;
    this.requireColons = emojiData.require_colons || true;
    this.managed = emojiData.managed || false;
    this.animated = emojiData.animated || false;
    this.available = emojiData.available || true;
  }
}

export class GuildEmojis extends List<string, Emoji> {
  client: Client;

  constructor(client: Client, ...emojis: EmojiData[]) {
    super(...emojis.map(e => new Emoji(client, e)));
    this.client = client;
  }
}