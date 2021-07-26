import { InviteData, InviteStageInstanceData, InviteTargetType } from '../types/index.ts';
import Client from '../client.ts';
import { Guild } from './guild.ts';
import { Channel } from './channel.ts';
import { User } from './user.ts';
import { Application } from './application.ts';
import { Member } from './member.ts';

export class StageInstanceInvite {
  client: Client;
  members: Member[];
  participants: number;
  speakers: number;
  topic: string;
  constructor(client: Client, data: InviteStageInstanceData, guild: string) {
    this.client = client;
    this.members = data.members.map(m => new Member(client, guild, m));
    this.participants = data.participant_count;
    this.speakers = data.speaker_count;
    this.topic = data.topic;
  }
}

export class Invite {
  client: Client;
  code: string;
  guild?: Guild;
  channel: Channel;
  inviter?: User;
  targetType?: string;
  targetUser?: User;
  targetApplication?: Application;
  approximatePresenceCount?: number;
  approximateMemberCount?: number;
  expiresAt?: Date;
  stageInstance?: StageInstanceInvite;
  uses?: number;
  maxUses?: number;
  maxAge?: number;
  temporary?: boolean;
  createdAt?: Date;
  constructor(client: Client, data: InviteData) {
    this.client = client;
    this.code = data.code;
    this.guild = data.guild ? new Guild(client, data.guild) : undefined;
    this.channel = new Channel(client, data.channel);
    this.inviter = data.inviter ? new User(client, data.inviter) : undefined;
    this.targetType = data.target_type ? InviteTargetType[data.target_type] : undefined;
    this.targetUser = data.target_user ? new User(client, data.target_user) : undefined;
    this.targetApplication = data.target_application ? new Application(client, data.target_application) : undefined;
    this.approximatePresenceCount = data.approximate_presence_count;
    this.approximateMemberCount = data.approximate_member_count;
    this.expiresAt = data.expires_at ? new Date(data.expires_at) : undefined;
    this.stageInstance = data.stage_instance ? new StageInstanceInvite(client, data.stage_instance, data.guild!.id) : undefined;
    this.uses = data.uses;
    this.maxUses = data.max_uses;
    this.maxAge = data.max_age;
    this.temporary = data.temporary;
    this.createdAt = data.created_at ? new Date(data.created_at) : undefined;
  }

  expireTimestamp() { return this.expiresAt?.getTime(); }
  createdTimestamp() { return this.createdAt?.getTime(); }
}