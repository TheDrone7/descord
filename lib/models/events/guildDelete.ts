import { GatewayPayload, GuildData } from '../../types';
import { Guild } from '../guild.ts';
import Client from '../../client.ts';

export default async (client: Client, raw: GatewayPayload) => {
  let guildData = raw.d as GuildData;
  client.log('DEBUG', `Guild Delete event received for guild with ID ${guildData.id}.`);
  if (guildData.unavailable) {
    let guild = new Guild(client, guildData);
    client.guilds.set(guild.id, guild);
  }
  else {
    client.guilds.delete(guildData.id);
  }
};