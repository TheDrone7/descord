import { List } from "../util/util.ts";
import Client from '../client.ts';

export class UserPresence {
  client: Client;

  constructor(client: Client, p: any) {

  }
}

export class GuildPresences extends List<string, UserPresence> {}