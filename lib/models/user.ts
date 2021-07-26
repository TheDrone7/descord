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
  premium: string;

  constructor(client: Client, userData: UserData) {
    this.client = client;
    this.id = userData.id;
    this.username = userData.username;
    this.discriminator = userData.discriminator;
    this.avatar = userData.avatar || undefined;
    this.bot = userData.bot;
    this.system = userData.system;
    this.mfaEnabled = userData.mfa_enabled;
    this.locale = userData.locale;

    if (userData.flags) {
      this.flags = [];
      if ((userData.flags & 0) === 0) this.flags.push('NONE');
      if ((userData.flags & (1 << 0)) === (1 << 0)) this.flags.push('DISCORD EMPLOYEE');
      if ((userData.flags & (1 << 1)) === (1 << 1)) this.flags.push('PARTNERED SERVER OWNER');
      if ((userData.flags & (1 << 2)) === (1 << 2)) this.flags.push('HYPESQUAD EVENTS');
      if ((userData.flags & (1 << 3)) === (1 << 3)) this.flags.push('BUG HUNTER LEVEL 1');
      if ((userData.flags & (1 << 6)) === (1 << 6)) this.flags.push('HOUSE BRAVERY');
      if ((userData.flags & (1 << 7)) === (1 << 7)) this.flags.push('HOUSE BRILLIANCE');
      if ((userData.flags & (1 << 8)) === (1 << 8)) this.flags.push('HOUSE BALANCE');
      if ((userData.flags & (1 << 9)) === (1 << 9)) this.flags.push('EARLY SUPPORTER');
      if ((userData.flags & (1 << 10)) === (1 << 10)) this.flags.push('TEAM USER');
      if ((userData.flags & (1 << 14)) === (1 << 14)) this.flags.push('BUG HUNTER LEVEL 2');
      if ((userData.flags & (1 << 16)) === (1 << 16)) this.flags.push('VERIFIED BOT');
      if ((userData.flags & (1 << 17)) === (1 << 17)) this.flags.push('EARLY VERIFIED BOT DEVELOPER');
      if ((userData.flags & (1 << 18)) === (1 << 18)) this.flags.push('DISCORD CERTIFIED MODERATOR');
    }
    this.premium = PremiumType[userData.premium_type || 0];
  }

  get avatarRLl() { return this.client.cdnBase + this.avatar !== null ? `avatars/${this.id}/${this.avatar}.${this.avatar!.startsWith('a_') ? 'gif' : 'png'}` : `embed/avatars/${parseInt(this.discriminator || "5") % 5}.png`; }
  get createdTimestamp() { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
  get createdDate() { return new Date(this.createdTimestamp); }
  get tag() { return `${this.username}#${this.discriminator}`}

  toString() { return `<@${this.id}>`; }
}