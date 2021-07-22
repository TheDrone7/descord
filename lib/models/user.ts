import Client from '../client.ts';
import { ClientPresence, Presence, UserData } from '../types/index.ts';

const UserFlags = ['None', 'Discord Employee', 'Partnered Server Owner', 'HypeSquad Events', 'Bug Hunter Level 1', 'House Bravery', 'House Brilliance', 'House Balance', 'Early Supporter', 'Team User', 'System', 'Bug Hunter Level 2', 'Verified Bot', 'Early Verified Bot Developer'] as const;
const PremiumTypes = ['None', 'Nitro Classic', 'Nitro'] as const;

export class User {
  client: Client;
  id: string;
  username?: string;
  discriminator?: string;
  avatar?: string | null;
  bot?: boolean;
  system?: boolean;
  mfaEnabled?: boolean;
  locale?: string;
  flags?: (typeof UserFlags[number])[];
  presence?: ClientPresence | Presence;
  premium: typeof PremiumTypes[number];

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
        this.flags = UserFlags.filter((_, i) => (1 << i) && userData.flags === userData.flags).filter(flag => flag !== 'None');
        this.premium = PremiumTypes[userData.premium_type || 0];
    }

    get avatarUrl() { return this.client.cdnBase + this.avatar !== null ? `avatars/${this.id}/${this.avatar}.${this.avatar!.startsWith('a_') ? 'gif' : 'png'}` : `embed/avatars/${parseInt(this.discriminator || "5") % 5}.png`; }
    get createdTimestamp() { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
    get createdDate() { return new Date(this.createdTimestamp); }
    get tag() { return `${this.username}#${this.discriminator}`}

    toString() { return `<@${this.id}>`; }
}