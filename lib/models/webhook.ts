import { User } from './models.ts';
import { WebhookData } from '../types/index.ts';
import Client from '../client.ts';

export class Webhook {
  client: Client;
  id: string;
  type: 'INCOMING'|'FOLLOWER';
  guildId?: string;
  channelId: string;
  user?: User;
  name: string|null;
  avatar: string|null;
  token?: string;
  applicationId: string|null;

  constructor(client: Client, data: WebhookData) {
    this.client = client;

    this.id = data.id;
    this.applicationId = data.application_id;
    this.avatar = data.avatar;
    this.channelId = data.channel_id;
    this.guildId = data.guild_id;
    this.name = data.name;
    this.token = data.token;
    this.type = (['INCOMING', 'FOLLOWER'] as const)[data.type];
    if (data.user) this.user = new User(client, data.user);
  }
}