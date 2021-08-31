import Client from '../../client.ts';
import { GatewayPayload, GuildMembersChunkData } from '../../types/index.ts';
import { Guild } from '../guild.ts';
import { Member } from '../member.ts';
import { UserPresence } from '../presence.ts';

export default (client: Client, raw: GatewayPayload) => {
  const chunkData = raw.d as GuildMembersChunkData;
  client.log('DEBUG', `Guild Members Chunk ${chunkData.chunk_index} of ${chunkData.chunk_count} received.`);
  const guild = client.guilds.get(chunkData.guild_id) as Guild;
  const presences = chunkData.presences?.map(p => new UserPresence(client, p));
  for (const member of chunkData.members) {
    const newMember = new Member(client, chunkData.guild_id, member);
    if (newMember.user) {
      if (presences && !newMember.user.presence) newMember.user.presence = presences.find(p => p.user.id === newMember.user!.id);
      guild.members?.set(newMember.user.id, newMember);
      client.users.set(newMember.user.id, newMember.user);
    }
  }
  client.guilds.set(guild.id, guild);
  client.execute('guildMembersChunk', guild);
}