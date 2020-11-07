import { List } from '../util/util.ts';
import Client from '../client.ts';

export class Emoji {
  readonly client: Client;
  constructor(client: Client, emojiData: any) {
    this.client = client;
  }
}
export class GuildEmojis extends List<string, Emoji> {}