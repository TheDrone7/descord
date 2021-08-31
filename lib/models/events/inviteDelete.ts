import Client from '../../client.ts';
import { GatewayPayload } from '../../types/index.ts';

export default (client: Client, raw: GatewayPayload) => {
  const inviteData = {
    code: raw.d.code,
    channel: client.channels.get(raw.d.channel_id),
    guild: client.guilds.get(raw.d.guild_id)
  };
  client.log('DEBUG', `Invite deleted for channel with ID ${inviteData.channel.id} in guild with ID ${inviteData.guild?.id}. CODE: ${inviteData.code}`);
  client.execute('inviteDelete', inviteData);
}