import Client from '../../client.ts';
import { ChannelData, GatewayPayload } from '../../types';
import { newChannel } from '../channel.ts';

export default async (client: Client, raw: GatewayPayload) => {
  let channelData = raw.d as ChannelData;
  let channel = newChannel(client, channelData);
  client.log('DEBUG', `Channel Create event received for channel with ID ${channel.id}.`);
  if (channelData.guild_id) client.guilds.get(channelData.guild_id).channels?.set(channel.id, channel);
  client.channels.set(channel.id, channel);
  client.execute('channelCreate', channel);
}