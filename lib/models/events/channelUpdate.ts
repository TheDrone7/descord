import Client from '../../client.ts';
import { ChannelData, GatewayPayload } from '../../types';
import { newChannel } from '../channel.ts';

export default async (client: Client, raw: GatewayPayload) => {
  let channelData = raw.d as ChannelData;
  client.log('DEBUG', `Channel Create event received for channel with ID ${channelData.id} was updated.`);
  let oldChannel = client.channels.get(channelData.id);
  let channel = newChannel(client, channelData);
  if (channelData.guild_id) client.guilds.get(channelData.guild_id).channels?.set(channel.id, channel);
  client.channels.set(channel.id, channel);
  client.execute('channelUpdate', oldChannel, channel);
}