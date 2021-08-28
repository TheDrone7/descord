export enum StagePrivacyLevel {
  'PUBLIC' = 1,
  'GUILD_ONLY'
}

export interface StageInstanceData {
  id: string;
  guild_id: string;
  channel_id: string;
  topic: string;
  privacy_level: StagePrivacyLevel;
  discoverable_disabled: boolean;
}