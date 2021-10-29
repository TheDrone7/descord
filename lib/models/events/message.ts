import { GatewayPayload, MessageData } from '../../types/index.ts';
import Client from '../../client.ts';
import { Message } from '../message.ts';

export default (client: Client, raw: GatewayPayload) => {
  const messageData = raw.d as MessageData;
  const message = new Message(client, messageData);
  client.log('DEBUG', `Message with ID ${message.id} received in channel with ID ${message.channelID}.`);
  client.messages.set(message.id, message);
  const channel = client.channels.get(messageData.channel_id);
  channel.lastMessageID = message.id;
  client.channels.set(channel.id, channel);
  if (channel.guildID) {
      const guild = client.guilds.get(channel.guildID);
      guild.channels.set(channel.id, channel);
      client.guilds.set(guild.id, guild);
  }
  client.execute('message', message);
}