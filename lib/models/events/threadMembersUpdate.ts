import Client from '../../client.ts';
import { GatewayPayload, ThreadMembersPayload } from '../../types/index.ts';
import { Thread } from '../channel.ts';
import { ThreadMember } from '../member.ts';

export default async (client: Client, raw: GatewayPayload) => {
  const threadUpdates = raw.d as ThreadMembersPayload;
  const thread = client.channels.get(threadUpdates.id) as Thread;
  client.log('DEBUG', `Thread Members Update event received for thread with ID ${thread.id}.`);
  thread.memberCount = threadUpdates.member_count;
  if (threadUpdates.added_members) {
    for (const newMember of threadUpdates.added_members) {
      const member = new ThreadMember(client, threadUpdates.guild_id, newMember);
      thread.members.set(member.userID, member);
    }
  }
  if (threadUpdates.removed_member_ids) {
    thread.members = thread.members.filter(m => !threadUpdates.removed_member_ids.some(id => id === m.userID));
  }
  client.channels.set(thread.id, thread);
  client.guilds.get(thread.guildID)?.channels!.set(thread.id, thread);
  client.execute('threadMembersUpdate', thread);
}