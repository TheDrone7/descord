import { List } from "../util/util.ts";
import Client from '../client.ts';
import { VoiceStateData } from '../types/index.ts';
import { Member } from './models.ts';

export class VoiceState {
  guildId: string|null;
  client: Client;
  channelId: string|null;
  userId: string;
  member: Member|null;
  sessionId: string;
  deaf: boolean;
  mute: boolean;
  selfDeaf: boolean;
  selfMute: boolean;
  isStreaming: boolean;
  videoEnabled: boolean;
  suppress: boolean;

  constructor(client: Client, voiceState: VoiceStateData, guildId?: string) {
    this.guildId = voiceState.guild_id || guildId!;
    this.client = client;
    this.channelId = voiceState.channel_id;
    this.userId = voiceState.user_id;
    this.member = voiceState.member ? new Member(client, this.guildId, voiceState.member) : null;
    this.sessionId = voiceState.session_id;
    this.deaf = voiceState.deaf;
    this.mute = voiceState.mute;
    this.selfDeaf = voiceState.self_deaf;
    this.selfMute = voiceState.self_mute;
    this.isStreaming = voiceState.self_stream || false;
    this.videoEnabled = voiceState.self_video;
    this.suppress = voiceState.suppress;
  }
}

export class GuildVoiceStates extends List<string, VoiceState> {
  client: Client;
  constructor(client: Client, ...voiceStates: VoiceStateData[]) {
    super(...voiceStates.map(v => new VoiceState(client, v)));
    this.client = client;
  }
}