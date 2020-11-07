import { List } from "../util/util.ts";

export class VoiceState {};
export class GuildVoiceStates extends List<string, VoiceState> {};