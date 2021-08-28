import Client from '../../client.ts';
import { ChannelData, GatewayPayload } from '../../types/index.ts';
import { Thread } from '../channel.ts';

export default (client: Client, raw: GatewayPayload) => {
  const threadData = raw.d as ChannelData;
  const thread = new Thread(client, threadData);
  client.log('DEBUG', `Thread Create event received for thread with ID ${thread.id}.`);
  client.guilds.get(thread.guildID).channels.set(thread.id, thread);
  client.channels.set(thread.id, thread);
  client.execute('threadCreate', thread);
}