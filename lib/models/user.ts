import { ClientPresence, PremiumType, Presence, UserData, UserFlags } from '../types/index.ts';
import Client from '../client.ts';

const UserFlagsList = {
  'NONE': 0,
  'DISCORD EMPLOYEE': 1 << 0,
  'PARTNERED SERVER OWNER': 1 << 1,
  'HYPESQUAD EVENTS': 1 << 2,
  'BUG HUNTER LEVEL 1': 1 << 3,
  'HOUSE BRAVERY': 1 << 6,
  'HOUSE BRILLIANCE': 1 << 7,
  'HOUSE BALANCE': 1 << 8,
  'EARLY SUPPORTER': 1 << 9,
  'TEAM USER': 1 << 10,
  'BUG HUNTER LEVEL 2': 1 << 14,
  'VERIFIED BOT': 1 << 16,
  'EARLY VERIFIED BOT DEVELOPER': 1 << 17,
  'DISCORD CERTIFIED MODERATOR': 1 << 18
};

export class User {
  client: Client;
  id: string;
  username?: string;
  discriminator?: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfaEnabled?: boolean;
  locale?: string;
  flags?: UserFlags[];
  presence?: ClientPresence | Presence;
  premium: 'NONE' | 'NITRO CLASSIC' | 'NITRO';

  constructor(client: Client, userData: UserData) {
    this.client = client;
    this.id = userData.id;
    this.username = userData.username;
    this.discriminator = userData.discriminator;
    this.avatar = userData.avatar;
    this.bot = userData.bot;
    this.system = userData.system;
    this.mfaEnabled = userData.mfa_enabled;
    this.locale = userData.locale;

    if (userData.flags) {
      this.flags = [];
      for (const flag in Object.keys(UserFlagsList))
        if ((userData.flags & UserFlagsList[flag]) === UserFlagsList[flag])
          this.flags.push(flag);
    }
    this.premium = PremiumType[userData.premium_type || 0];
  }

  get avatarRLl() { return this.client.cdnBase + this.avatar !== null ? `avatars/${this.id}/${this.avatar}.${this.avatar!.startsWith('a_') ? 'gif' : 'png'}` : `embed/avatars/${parseInt(this.discriminator || "5") % 5}.png`; }
  get createdTimestamp() { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
  get createdDate() { return new Date(this.createdTimestamp); }
  get tag() { return `${this.username}#${this.discriminator}`}

  toString() { return `<@${this.id}>`; }
}