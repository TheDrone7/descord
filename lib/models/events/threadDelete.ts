import Client from '../../client.ts';
import { ChannelData, GatewayPayload } from '../../types/index.ts';
import { Thread } from '../channel.ts';

export default async (client: Client, raw: GatewayPayload) => {
  const threadData = raw.d as ChannelData;
  client.log('DEBUG', `Thread Delete event received for thread with ID ${threadData.id}.`);
  const thread = client.channels.get(threadData.id) as Thread;
  if (thread) client.channels.delete(threadData.id);
  client.execute('threadDelete', thread);
}