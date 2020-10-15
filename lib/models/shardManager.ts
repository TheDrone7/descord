import Shard from './shard.ts';
import { List } from '../util/util.ts';
import Client from '../client.ts';

export default class ShardManager extends List<string, Shard> {
    #client: Client;

    constructor(client: Client) {
        super();
        this.#client = client;
    }

    async initialize(url: string, id: number, total: number) {
        let newShard = new Shard(this.#client, url, [id, total]);
    }
}
