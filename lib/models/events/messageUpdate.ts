import { GatewayPayload, MessageData } from '../../types/index.ts';
import Client from '../../client.ts';
import { Message } from '../message.ts';

export default (client: Client, raw: GatewayPayload) => {
  const messageData = raw.d as MessageData;
  const oldMessage = client.messages.get(messageData.id) as Message;
  const message = client.messages.get(messageData.id) as Message;
  const newMessage = new Message(client, messageData);

  if (newMessage.attachments.size !== message.attachments.size) message.attachments = newMessage.attachments;
  if (newMessage.content) message.content = newMessage.content;
  if (newMessage.embeds.length !== message.embeds.length) message.embeds = newMessage.embeds;
  if (newMessage.mentionEveryone !== message.mentionEveryone) message.mentionEveryone = newMessage.mentionEveryone;
  if (newMessage.pinned !== message.pinned) message.pinned = newMessage.pinned;
  if (newMessage.reactions.length !== message.reactions.length) message.reactions.length = newMessage.reactions.length;
  if (newMessage.tts !== message.tts) message.tts = newMessage.tts;
  if (newMessage.mentions !== message.mentions) message.mentions = newMessage.mentions;

  client.log('DEBUG', `Message with ID ${newMessage.id} updated in channel with ID ${newMessage.channelID}.`);
  client.messages.set(message.id, message);
  client.execute('messageUpdate', oldMessage, message);
}