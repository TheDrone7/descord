import { GatewayPayload, GuildMemberData } from '../../types/index.ts';
import Client from '../../client.ts';
import { Guild } from '../guild.ts';
import { Member } from '../member.ts';

export default (client: Client, raw: GatewayPayload) => {
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const member = new Member(client, guild.id, raw.d as GuildMemberData);
  const oldMember = guild.members?.get(member.user?.id);
  client.log('DEBUG', `Guild Member Update event received for user with ID: ${member.user?.id} in guild with ID ${guild.id}.`);
  guild.members?.set(member.user?.id, member);
  client.guilds.set(guild.id, guild);
  if (member.user) client.users.set(member.user.id, member.user);
  client.execute('guildMemberUpdate', oldMember, member);
}