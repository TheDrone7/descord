import Client from '../../client.ts';
import { Shard } from '../shard.ts';
import { GatewayPayload } from '../../types/index.ts';
import guildUpdate from './guildUpdate.ts';
import guildDelete from './guildDelete.ts';
import channelCreate from './channelCreate.ts';
import channelUpdate from './channelUpdate.ts';
import channelDelete from './channelDelete.ts';
import channelPinsUpdate from './channelPinsUpdate.ts';
import threadCreate from './threadCreate.ts';
import threadUpdate from './threadUpdate.ts';
import threadDelete from './threadDelete.ts';
import threadMembersUpdate from './threadMembersUpdate.ts';

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
    case 'THREAD_CREATE':
      await threadCreate(client, raw);
      break;
    case 'THREAD_UPDATE':
      await threadUpdate(client, raw);
      break;
    case 'THREAD_DELETE':
      await threadDelete(client, raw);
      break;
    case 'THREAD_LIST_SYNC':
      client.log('DEBUG', raw.d);
      break;
    case 'THREAD_MEMBERS_UPDATE':
      await threadMembersUpdate(client, raw);
  }
};