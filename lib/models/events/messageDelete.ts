import { GatewayPayload } from '../../types/index.ts';
import Client from '../../client.ts';
import { Message } from '../message.ts';

export default (client: Client, raw: GatewayPayload) => {
  const messageData = raw.d as {
    id: string,
    channel_id: string;
    guild_id?: string;
  };
  const message = client.messages.get(messageData.id) as Message;
  client.log('DEBUG', `Message with ID ${message.id} deleted in channel with ID ${message.channelID}.`);
  client.messages.delete(messageData.id)
  client.execute('messageDelete', message);
}