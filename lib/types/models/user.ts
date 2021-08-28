export type UserFlags = 'NONE' | 'DISCORD EMPLOYEE' | 'PARTNERED SERVER OWNER' | 'HYPESQUAD EVENTS' | 'BUG HUNTER LEVEL 1' | 'HOUSE BRAVERY' | 'HOUSE BRILLIANCE' | 'HOUSE BALANCE' | 'EARLY SUPPORTER' | 'TEAM USER' | 'BUG HUNTER LEVEL 2' | 'VERIFIED BOT' | 'EARLY VERIFIED BOT DEVELOPER' | 'DISCORD CERTIFIED MODERATOR';
export enum PremiumType {
  'NONE',
  'NITRO CLASSIC',
  'NITRO'
}

export interface UserData {
  id: string;
  username?: string;
  discriminator?: string;
  avatar?: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  flags?: number;
  premium_type?: PremiumType;
  public_flags?: number
}