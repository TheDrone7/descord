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
import guildBanAdd from './guildBanAdd.ts';
import guildBanRemove from './guildBanRemove.ts';

export default async (shard: Shard, client: Client, raw: GatewayPayload) => {
  switch (raw.t!) {
    case 'GUILD_UPDATE':
      guildUpdate(client, raw);
      break;
    case 'GUILD_DELETE':
      guildDelete(client, raw);
      break;
    case 'CHANNEL_CREATE':
      channelCreate(client, raw);
      break;
    case 'CHANNEL_UPDATE':
      channelUpdate(client, raw);
      break;
    case 'CHANNEL_DELETE':
      channelDelete(client, raw);
      break;
    case 'CHANNEL_PINS_UPDATE':
      channelPinsUpdate(client, raw);
      break;
    case 'THREAD_CREATE':
      threadCreate(client, raw);
      break;
    case 'THREAD_UPDATE':
      threadUpdate(client, raw);
      break;
    case 'THREAD_DELETE':
      threadDelete(client, raw);
      break;
    case 'THREAD_LIST_SYNC':
      client.log('DEBUG', raw.d);
      break;
    case 'THREAD_MEMBERS_UPDATE':
      threadMembersUpdate(client, raw);
      break;
    case 'GUILD_BAN_ADD':
      guildBanAdd(client, raw);
      break;
    case 'GUILD_BAN_REMOVE':
      guildBanRemove(client, raw);
      break;
  }
};