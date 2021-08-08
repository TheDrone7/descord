import Client from '../../client.ts';
import { GatewayPayload } from '../../types/index.ts';

export default async (client: Client, raw: GatewayPayload) => {
  client.log('DEBUG', raw.d);
}