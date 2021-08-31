import Client from '../../client.ts';
import { GatewayPayload, InviteData } from '../../types/index.ts';
import { Invite } from '../invite.ts';

export default (client: Client, raw: GatewayPayload) => {
  const invite = new Invite(client, raw.d as InviteData);
  client.log('DEBUG', `Invite created for channel with ID ${invite.channel.id} in guild with ID ${invite.guild?.id}. CODE: ${invite.code}`);
  client.execute('inviteCreate', invite);
}