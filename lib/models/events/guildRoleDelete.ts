import Client from '../../client.ts';
import { GatewayPayload } from '../../types/index.ts';
import { Guild } from '../guild.ts';

export default (client: Client, raw: GatewayPayload) => {
  const roleID = raw.d.role_id as String;
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const role = guild.roles?.get(roleID) || { id: roleID };
  client.log('DEBUG', `Guild Role Delete event received for role with ID: ${roleID} in guild with ID ${guild.id}`);
  guild.roles?.delete(roleID);
  client.guilds.set(guild.id, guild);
  client.execute('guildRoleDelete', role);
}