import { IntegrationData } from '../types/index.ts';
import Client from '../client.ts';
import { User } from './user.ts';
import { Application } from './application.ts';

export class Integration {
  client: Client;
  id: string;
  name: string;
  type: string;
  enabled?: boolean;
  syncing?: boolean;
  roleID?: string;
  enableEmoticons?: boolean;
  expireBehavior?: string;
  expireGracePeriod?: number;
  user?: User;
  account: { id: string; name: string };
  syncedAt?: Date;
  subscriberCount?: number;
  revoked?: boolean;
  application?: Application;
  constructor(client: Client, data: IntegrationData) {
    this.client = client;
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.enabled = data.enabled;
    this.syncing = data.syncing;
    this.roleID = data.role_id;
    this.enableEmoticons = data.enable_emoticons;
    this.expireBehavior = data.expire_behavior === 0 ? 'Remove Role' : 'Kick';
    this.expireGracePeriod = data.expire_grace_period;
    if (data.user) this.user = new User(client, data.user);
    this.account = data.account;
    if (data.synced_at) this.syncedAt = new Date(data.synced_at);
    this.subscriberCount = data.subscriber_count;
    this.revoked = data.revoked;
    if (data.application) this.application = new Application(client, data.application);
  }
}