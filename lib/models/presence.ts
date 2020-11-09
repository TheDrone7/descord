import { List } from '../util/util.ts';
import Client from '../client.ts';
import { Presence } from '../types/types.ts';

export class UserPresence {
  client: Client;

  constructor(client: Client, p: any) {
    this.client = client;
  }

}

export class GuildPresences extends List<string, UserPresence> {
  client: Client;

  constructor(client: Client, ...presences: Presence[]) {
    super(...presences.map(p => new UserPresence(client, p)));
    this.client = client;
  }
}