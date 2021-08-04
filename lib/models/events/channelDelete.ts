import Client from '../../client.ts';
import { ChannelData, GatewayPayload } from '../../types';

export default async (client: Client, raw: GatewayPayload) => {
  let channel = raw.d as ChannelData;
  client.log('DEBUG', `Channel with ID ${channel.id} was deleted.`);
  let cachedChannel = client.channels.get(channel.id);
  if (channel.guild_id) client.guilds.get(channel.guild_id).channels?.delete(channel.id);
  client.channels.delete(channel.id);
  client.execute('channelDelete', cachedChannel);
}