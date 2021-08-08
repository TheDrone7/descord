import { ThreadMemberData, UserData } from './models/index.ts';

export interface SessionStartLimit {
  total: number,
  remaining: number,
  reset_after: number
}

export interface Gateway {
  url: string,
  shards: number,
  session_start_limit: SessionStartLimit
}

export interface GatewayPayload {
  op: number,
  d: any,
  s?: number,
  t?: string
}

export interface ReadyPayload {
  v: number;
  user: UserData;
  private_channels: [];
  guilds: any[];
  session_id: string;
  shard?: [number, number]
}

export interface ThreadMembersPayload {
  id: string;
  guild_id: string;
  member_count: number;
  added_members?: ThreadMemberData[];
  removed_member_ids?: string[];
}