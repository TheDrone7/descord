import Shard from './shard.ts';
import { List } from '../util/util.ts';
import Client from '../client.ts';
import { ClientPresence, Intent } from '../types/index.ts';

export default class ShardManager extends List<string, Shard> {
  #client: Client;

  constructor(client: Client) {
    super();
    this.#client = client;
  }

  async initialize(url: string, id: number, total: number, options?: { presence?: ClientPresence, intents?: Intent[] }) {
    let newShard = new Shard(this.#client, url, {
      shard: [id, total],
      intent: options?.intents || ['GUILDS'],
      presence: options?.presence
    });
    this.set(id, newShard);
  }
}
