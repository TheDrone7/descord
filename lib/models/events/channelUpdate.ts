import Client from '../../client.ts';
import { ChannelData, GatewayPayload } from '../../types/index.ts';
import { newChannel } from '../channel.ts';

export default (client: Client, raw: GatewayPayload) => {
  const channelData = raw.d as ChannelData;
  const oldChannel = client.channels.get(channelData.id);
  const channel = newChannel(client, channelData);
  client.log('DEBUG', `Channel Update event received for channel with ID ${channelData.id}.`);
  if (channelData.guild_id) client.guilds.get(channelData.guild_id).channels?.set(channel.id, channel);
  client.channels.set(channel.id, channel);
  client.execute('channelUpdate', oldChannel, channel);
}