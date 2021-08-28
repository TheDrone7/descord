import Client from '../../client.ts';
import { GatewayPayload, GuildData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { Member } from '../member.ts';
import { Channel } from '../channel.ts';
import { Emoji } from '../emoji.ts';

export default (client: Client, raw: GatewayPayload) => {
  const guildData = raw.d as GuildData;
  const guild = new Guild(client, guildData);
  client.log('DEBUG', `Guild Update event received for guild with ID ${guild.id}.`);
  client.guilds.set(guild.id, guild);
  guild.members!.forEach((m: Member) => {client.users.set(m.user?.id, m.user);});
  guild.channels?.forEach((c: Channel) => {client.channels.set(c.id, c);});
  guild.emojis?.forEach((e: Emoji) => {client.emojis.set(e.id, e);});
};