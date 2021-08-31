import Client from '../../client.ts';
import { GatewayPayload, IntegrationData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { Integration } from '../integration.ts';

export default (client: Client, raw: GatewayPayload) => {
  const integration = new Integration(client, raw.d as IntegrationData);
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const oldIntegration = guild.integrations?.get(integration.id);
  client.log('DEBUG', `Guild integration update event received for integration with ID ${integration.id} in guild with ID ${guild.id}`);
  guild.integrations?.set(integration.id, integration);
  client.guilds.set(guild.id, guild);
  client.execute('integrationUpdate', oldIntegration, integration);
}