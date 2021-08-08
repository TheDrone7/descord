import Client from '../../client.ts';
import { ChannelPinsUpdateData, GatewayPayload } from '../../types/index.ts';
import { TextChannel } from '../channel.ts';

export default async (client: Client, raw: GatewayPayload) => {
  const channelPinsData = raw.d as ChannelPinsUpdateData;
  const channel = client.channels.get(channelPinsData.channel_id) as TextChannel;
  client.log('DEBUG', `Channel Pins Update event received for channel with ID ${channel.id}.`);
  channel.lastPinAt = channelPinsData.last_pin_timestamp ? new Date(channelPinsData.last_pin_timestamp) : undefined;
  client.channels.set(channel.id, channel);
  if (channelPinsData.guild_id) client.guilds.get(channelPinsData.guild_id).channels?.set(channel.id, channel);
}