import Client from '../../client.ts';
import { GatewayPayload, UserData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { User } from '../user.ts';

export default (client: Client, raw: GatewayPayload) => {
  const userData = raw.d as UserData;
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const user = new User(client, userData);
  client.log('DEBUG', `Guild Member Remove event received for user with ID: ${user.id} in guild with ID: ${raw.d.guild_id}`);
  guild.members!.delete(user.id);
  client.guilds.set(guild.id, guild);
  client.execute('guildMemberRemove', guild, user);
}