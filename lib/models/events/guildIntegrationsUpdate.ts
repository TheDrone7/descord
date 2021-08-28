import { GatewayPayload } from '../../types/index.ts';
import Client from '../../client.ts';
import { Guild } from '../guild.ts';

export default (client: Client, raw: GatewayPayload) => {
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  client.log('DEBUG', `Guild Integrations Update event received for guild with ID ${guild.id}.`);
  client.execute('guildIntegrationsUpdate', guild);
}