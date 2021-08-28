import Client from '../../client.ts';
import { ChannelData, GatewayPayload } from '../../types/index.ts';

export default (client: Client, raw: GatewayPayload) => {
  const channel = raw.d as ChannelData;
  const cachedChannel = client.channels.get(channel.id);
  client.log('DEBUG', `Channel Delete event received for channel with ID ${channel.id}.`);
  if (channel.guild_id) client.guilds.get(channel.guild_id).channels?.delete(channel.id);
  client.channels.delete(channel.id);
  client.execute('channelDelete', cachedChannel);
}