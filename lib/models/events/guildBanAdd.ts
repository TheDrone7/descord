import Client from '../../client.ts';
import { GatewayPayload, UserData } from '../../types/index.ts';
import { User } from '../user.ts';
import { Guild } from '../guild.ts';

export default (client: Client, raw: GatewayPayload) => {
  const user = new User(client, raw.d.user as UserData);
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  client.log('DEBUG', `Guild Ban Add event received for user with ID ${user.id} in guild with ID: ${guild.id}`);
  guild.members!.delete(user.id);
  client.guilds.set(guild.id, guild);
  client.execute('guildBanAdd', guild, user);
}