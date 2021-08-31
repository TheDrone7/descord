import Client from '../../client.ts';
import { GatewayPayload, RoleData } from '../../types/index.ts';
import { Role } from '../role.ts';
import { Guild } from '../guild.ts';

export default (client: Client, raw: GatewayPayload) => {
  const role = new Role(client, raw.d.guild_id, raw.d.role as RoleData);
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const oldRole = guild.roles?.get(role.id);
  client.log('DEBUG', `Guild role update event received for role with ID ${role.id} in guild with ID ${guild.id}`);
  guild.roles?.set(role.id, role);
  client.guilds.set(guild.id, guild);
  client.execute('guildRoleUpdate', oldRole, role);
}