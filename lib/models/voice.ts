import { VoiceRegionData, VoiceStateData } from '../types/index.ts';
import Client from '../client.ts';
import { List } from "../util/util.ts";
import { Member } from './models.ts';

export class VoiceState {
  client: Client;
  guildID: string;
  channelID: string;
  userID: string;
  member?: Member;
  sessionID: string;
  deaf: boolean;
  mute: boolean;
  selfDeaf: boolean;
  selfMute: boolean;
  isStreaming: boolean;
  videoEnabled: boolean;
  suppress: boolean;
  requestToSpeakTime?: Date;

  constructor(client: Client, voiceState: VoiceStateData, guildId?: string) {
    this.guildID = voiceState.guild_id || guildId!;
    this.client = client;
    this.channelID = voiceState.channel_id || undefined;
    this.userID = voiceState.user_id;
    this.member = voiceState.member ? new Member(client, guildId, voiceState.member) : undefined;
    this.sessionID = voiceState.session_id;
    this.deaf = voiceState.deaf;
    this.mute = voiceState.mute;
    this.selfDeaf = voiceState.self_deaf;
    this.selfMute = voiceState.self_mute;
    this.isStreaming = voiceState.self_stream || false;
    this.videoEnabled = voiceState.self_video;
    this.suppress = voiceState.suppress;
    this.requestToSpeakTime = voiceState.request_to_speak_timestamp ? new Date(voiceState.request_to_speak_timestamp) : undefined;
  }
}

export class VoiceRegion {
  client: Client;
  id: string;
  name: string;
  vip: boolean;
  optimal: boolean;
  deprecated: boolean;
  custom: boolean;

  constructor(client: Client, data: VoiceRegionData) {
    this.client = client;
    this.id = data.id;
    this.name = data.name;
    this.vip = data.vip;
    this.optimal = data.optimal;
    this.deprecated = data.deprecated;
    this.custom = data.custom;
  }
}

export class GuildVoiceStates extends List<string, Voice> {
  client: Client;
  constructor(client: Client, ...voiceStates: VoiceStateData[]) {
    super(...voiceStates.map(v => new VoiceState(client, v)));
    this.client = client;
  }
}