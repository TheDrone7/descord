import { WebhookData, WebhookType } from '../types/index.ts';
import Client from '../client.ts';
import { Channel, Guild, User } from './models.ts';

export class Webhook {
  client: Client;

  id: string;
  type: string;
  guildID?: string;
  channelID: string;
  user?: User;
  name?: string;
  avatar?: string;
  token?: string;
  applicationID?: string;
  sourceGuild?: Guild;
  sourceChannel?: Channel;

  constructor(client: Client, data: WebhookData) {
    this.client = client;

    this.id = data.id;
    this.type = WebhookType[data.type];
    this.guildID = data.guild_id;
    this.channelID = data.channel_id;
    this.user = data.user ? new User(client, data.user) : undefined;
    this.name = data.name || undefined;
    this.avatar = data.avatar || undefined;
    this.token = data.token;
    this.applicationID = data.application_id;
    this.sourceGuild = data.source_guild ? new Guild(data.source_guild) : undefined;
    this.sourceChannel = data.source_channel ? new Channel(data.source_channel) : undefined;
  }
}