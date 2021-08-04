import Client from '../../client.ts';
import { Shard } from '../shard.ts';
import { GatewayPayload } from '../../types';
import guildUpdate from './guildUpdate.ts';
import guildDelete from './guildDelete.ts';
import channelCreate from './channelCreate.ts';
import channelUpdate from './channelUpdate.ts';
import channelDelete from './channelDelete.ts';
import channelPinsUpdate from './channelPinsUpdate.ts';

export default async (shard: Shard, client: Client, raw: GatewayPayload) => {
  switch (raw.t!) {
    case 'GUILD_UPDATE':
      await guildUpdate(client, raw);
      break;
    case 'GUILD_DELETE':
      await guildDelete(client, raw);
      break;
    case 'CHANNEL_CREATE':
      await channelCreate(client, raw);
      break;
    case 'CHANNEL_UPDATE':
      await channelUpdate(client, raw);
      break;
    case 'CHANNEL_DELETE':
      await channelDelete(client, raw);
      break;
    case 'CHANNEL_PINS_UPDATE':
      await channelPinsUpdate(client, raw);
      break;
  }
};