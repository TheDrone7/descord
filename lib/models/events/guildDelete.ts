import Client from '../../client.ts';
import { GatewayPayload, GuildData } from '../../types/index.ts';
import { Guild } from '../guild.ts';

export default async (client: Client, raw: GatewayPayload) => {
  const guildData = raw.d as GuildData;
  client.log('DEBUG', `Guild Delete event received for guild with ID ${guildData.id}.`);
  if (!guildData.unavailable) {
    const guild = new Guild(client, guildData);
    client.guilds.set(guild.id, guild);
  }
  else {
    client.guilds.delete(guildData.id);
  }
};