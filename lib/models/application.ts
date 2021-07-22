import { ApplicationData, ApplicationFlag } from '../types/index.ts';
import { User } from './user.ts';
import Client from '../client.ts';
import { Team } from './team.ts';

export class Application {
  client: Client;

  id: string;
  name: string;
  icon: null|string;
  description: string;
  rpcOrigins?: string[];
  public: boolean;
  requiredCodeGrant: boolean;
  termsOfServiceURL?: string;
  privacyPolicyURL?: string;
  owner?: User;
  summary: string;
  verifyKey: string;
  team?: Team;
  guildId?: string;
  primarySKUID?: string;
  slug?: string;
  coverImage?: string;
  flags?: ApplicationFlag[];
  constructor(client: Client, appData: ApplicationData) {
    this.client = client;

    this.id = appData.id;
    this.name = appData.name;
    this.icon = appData.icon;
    this.description = appData.description;
    this.rpcOrigins = appData.rpc_origins;
    this.public = appData.bot_public;
    this.requiredCodeGrant = appData.bot_require_code_grant;
    this.termsOfServiceURL = appData.terms_of_service_url;
    this.privacyPolicyURL = appData.privacy_policy_url;
    if (appData.owner) this.owner = new User(client, appData.owner);
    this.summary = appData.summary;
    this.verifyKey = appData.verify_key;
    if (appData.team !== null) this.team = new Team(client, appData.team);
    this.guildId = appData.guild_id;
    this.primarySKUID = appData.primary_sku_id;
    this.slug = appData.slug;
    this.coverImage = appData.cover_image;
    this.flags = [];

    if (appData.flags) {
      if ((appData.flags & 1 << 12) === 1 << 12) this.flags.push('GATEWAY_PRESENCE');
      if ((appData.flags & 1 << 13) === 1 << 13) this.flags.push('GATEWAY_PRESENCE_LIMITED');
      if ((appData.flags & 1 << 14) === 1 << 14) this.flags.push('GATEWAY_GUILD_MEMBERS');
      if ((appData.flags & 1 << 15) === 1 << 15) this.flags.push('GATEWAY_GUILD_MEMBERS_LIMITED');
      if ((appData.flags & 1 << 16) === 1 << 16) this.flags.push('VERIFICATION_PENDING_GUILD_LIMIT');
      if ((appData.flags & 1 << 17) === 1 << 17) this.flags.push('EMBEDDED');
    }
  }

  get iconURL() { return this.icon === null ? null : this.client.cdnBase + `app-icons/${this.id}/${this.icon}.png`; }
  get coverImageURL() { return this.coverImage === undefined ? undefined : this.client.cdnBase + `app-icons/${this.id}/${this.coverImage}.png`; }

  get createdTimestamp() { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
  get createdAt() { return new Date(this.createdTimestamp); }
}