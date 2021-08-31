import Client from '../../client.ts';
import { GatewayPayload, RoleData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { Role } from '../role.ts';

export default (client: Client, raw: GatewayPayload) => {
  const roleData = raw.d.role as RoleData;
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const role = new Role(client, guild.id, roleData);
  client.log('DEBUG', `Guild Role Create event received for role with ID: ${role.id} in guild with ID ${guild.id}`);
  guild.roles?.set(role.id, role);
  client.guilds.set(guild.id, guild);
  client.execute('guildRoleCreate', role);
}