import { StageInstanceData, StagePrivacyLevel } from '../types/index.ts';
import Client from '../client.ts';

export class StageInstance {
  client: Client;
  id: string;
  guildID: string;
  channelID: string;
  topic: string;
  privacyLevel: string;
  discoverable: boolean;
  constructor(client: Client, data: StageInstanceData) {
    this.client = client;
    this.id = data.id;
    this.guildID = data.guild_id;
    this.channelID = data.channel_id;
    this.topic = data.topic;
    this.privacyLevel = StagePrivacyLevel[data.privacy_level];
    this.discoverable = !data.discoverable_disabled;
  }

  get guild() { return this.client.guilds.get(this.guildID); }
  get channel() { return this.guild.channels?.get(this.channelID); }
}