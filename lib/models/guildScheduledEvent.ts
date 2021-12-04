import { User } from './models.ts';
import {
  EventEntityMetadata,
  EventEntityType,
  EventPrivacyLevel,
  EventStatus,
  GuildScheduledEventData
} from '../types/models/guild.ts';
import Client from '../client.ts';

export class GuildScheduledEvent {
  id: string;
  guildID: string;
  channelID?: string;
  creatorID?: string;
  name: string;
  description?: string;
  scheduledStartTime: Date;
  scheduledEndTime?: Date;
  privacyLevel: string;
  status: string;
  entityType: string;
  entityID?: string;
  entityMetadata?: EventEntityMetadata;
  creator?: User;
  userCount?: number

  constructor(client: Client, data: GuildScheduledEventData) {
    this.id = data.id;
    this.guildID = data.guild_id;
    this.channelID = data.channel_id || undefined;
    this.creatorID = data.creator_id || undefined;
    this.name = data.name;
    this.description = data.description;
    this.scheduledStartTime = new Date(data.scheduled_start_time);
    this.scheduledEndTime = data.scheduled_end_time ? new Date(data.scheduled_end_time) : undefined;
    this.privacyLevel = EventPrivacyLevel[data.privacy_level];
    this.status = EventStatus[data.status];
    this.entityType = EventEntityType[data.entity_type];
    this.entityID = data.entity_id || undefined;
    this.entityMetadata = data.entity_metadata || undefined;
    this.creator = data.creator ? new User(client, data.creator) : undefined;
    this.userCount = data.user_count;
  }

  get startTimestamp() {
    return this.scheduledStartTime.getTime();
  }

  get endTimestamp() {
    return this.scheduledEndTime?.getTime();
  }
}