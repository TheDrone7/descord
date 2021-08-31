import Client from '../../client.ts';
import { GatewayPayload, IntegrationData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { Integration } from '../integration.ts';

export default (client: Client, raw: GatewayPayload) => {
  const integrationData = raw.d.role as IntegrationData;
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const integration = new Integration(client, integrationData);
  client.log('DEBUG', `Guild Integration Create event received for integration with ID: ${integration.id} in guild with ID ${guild.id}`);
  guild.roles?.set(integration.id, integration);
  client.guilds.set(guild.id, guild);
  client.execute('guildRoleCreate', integration);
}