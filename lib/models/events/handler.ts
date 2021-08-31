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
import guildEmojisUpdate from './guildEmojisUpdate.ts';
import guildStickersUpdate from './guildStickersUpdate.ts';
import guildIntegrationsUpdate from './guildIntegrationsUpdate.ts';
import guildMemberAdd from './guildMemberAdd.ts';
import guildMemberRemove from './guildMemberRemove.ts';
import guildMemberUpdate from './guildMemberUpdate.ts';
import guildMembersChunk from './guildMembersChunk.ts';
import guildRoleCreate from './guildRoleCreate.ts';
import guildRoleUpdate from './guildRoleUpdate.ts';
import guildRoleDelete from './guildRoleDelete.ts';
import integrationCreate from './integrationCreate.ts';
import integrationUpdate from './integrationUpdate.ts';
import integrationDelete from './integrationDelete.ts';
import inviteCreate from './inviteCreate.ts';
import inviteDelete from './inviteDelete.ts';

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
    case 'GUILD_EMOJIS_UPDATE':
      guildEmojisUpdate(client, raw);
      break;
    case 'GUILD_STICKERS_UPDATE':
      guildStickersUpdate(client, raw);
      break;
    case 'GUILD_INTEGRATIONS_UPDATE':
      guildIntegrationsUpdate(client, raw);
      break;
    case 'GUILD_MEMBER_ADD':
      guildMemberAdd(client, raw);
      break;
    case 'GUILD_MEMBER_REMOVE':
      guildMemberRemove(client, raw);
      break;
    case 'GUILD_MEMBER_UPDATE':
      guildMemberUpdate(client, raw);
      break;
    case 'GUILD_MEMBERS_CHUNK':
      guildMembersChunk(client, raw);
      break;
    case 'GUILD_ROLE_CREATE':
      guildRoleCreate(client, raw);
      break;
    case 'GUILD_ROLE_UPDATE':
      guildRoleUpdate(client, raw);
      break;
    case 'GUILD_ROLE_DELETE':
      guildRoleDelete(client, raw);
      break;
    case 'INTEGRATION_CREATE':
      integrationCreate(client, raw);
      break;
    case 'INTEGRATION_UPDATE':
      integrationUpdate(client, raw);
      break;
    case 'INTEGRATION_DELETE':
      integrationDelete(client, raw);
      break;
    case 'INVITE_CREATE':
      inviteCreate(client, raw);
      break;
    case 'INVITE_DELETE':
      inviteDelete(client, raw);
      break;
  }
};