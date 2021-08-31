import Client from '../../client.ts';
import { GatewayPayload } from '../../types/index.ts';
import { Guild } from '../guild.ts';

export default (client: Client, raw: GatewayPayload) => {
  const integrationID = raw.d.id as String;
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const integration = guild.integrations?.get(integrationID) || { id: integrationID };
  client.log('DEBUG', `Guild Integration Delete event received for integration with ID: ${integrationID} in guild with ID ${guild.id}`);
  guild.integrations?.delete(integrationID);
  client.guilds.set(guild.id, guild);
  client.execute('integrationDelete', integration);
}