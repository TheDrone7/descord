import Client from '../../client.ts';
import { GatewayPayload, GuildMemberData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { Member } from '../member.ts';

export default (client: Client, raw: GatewayPayload) => {
  const memberData = raw.d as GuildMemberData;
  const guild = client.guilds.get(raw.d.guild_id) as Guild;
  const member = new Member(client, guild.id, memberData);
  guild.members!.set(member.id, member);
  if (member.user) client.users.set(member.user.id, member.user);
  client.guilds.set(guild.id, guild);
  client.execute('guildMemberAdd', guild, member);
}