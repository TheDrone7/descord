import Client from '../../client.ts';
import { GatewayPayload, GuildMemberData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { Member } from '../member.ts';

export default (client: Client, raw: GatewayPayload) => {
  const memberData = raw.d as GuildMemberData;
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const member = new Member(client, guild.id, memberData);
  client.log('DEBUG', `Guild Member Add event received for user with ID: ${member.user?.id} in guild with ID: ${raw.d.guild_id}`);
  guild.members!.set(member.user!.id, member);
  if (member.user) client.users.set(member.user.id, member.user);
  client.guilds.set(guild.id, guild);
  client.execute('guildMemberAdd', guild, member);
}