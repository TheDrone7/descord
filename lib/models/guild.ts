import Client from '../client.ts';
import {
  Channel,
  GuildChannels,
  GuildEmojis,
  GuildMembers,
  GuildPresences,
  GuildRoles,
  GuildVoiceStates,
  Member
} from './models.ts';
import { GuildData } from '../types/modelData.ts';
import List from '../util/list.ts';

export class Guild {
  readonly client: Client;

  readonly id: string;
  readonly available: boolean;
  name?: string;
  icon?: string;
  splash?: string;
  discoverySplash?: string;
  owner?: Member;
  ownerId?: string;
  region?: string;
  afkChannelId?: string;
  afkTimeout?: number;
  widgetEnabled?: boolean;
  widgetChannelId?: string;
  widgetChannel?: Channel;
  verificationLevel?: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  defaultMessageNotifications?: 'ALL_MESSAGES' | 'ONLY_MENTIONS';
  explicitContentFilter?: 'DISABLED' | 'MEMBERS_WITHOUT_ROLES' | 'ALL_MEMBERS';
  roles?: GuildRoles;
  emojis?: GuildEmojis;
  features?: ('INVITE_SPLASH' | 'VIP_REGIONS' | 'VANITY_URL' | 'VERIFIED' | 'PARTNERED' | 'COMMUNITY' | 'COMMERCE' | 'NEWS' | 'DISCOVERABLE' | 'FEATURABLE' | 'ANIMATED_ICON' | 'BANNER' | 'WELCOME_SCREEN_ENABLED')[];
  mfaEnabled?: boolean;
  applicationId?: string;
  systemChannelId?: string;
  systemChannelFlags?: ('SUPPRESS_JOIN_NOTIFICATIONS' | 'SUPPRESS_PREMIUM_SUBSCRIPTIONS')[];
  rulesChannelId?: string;
  joinedAt?: Date;
  large?: boolean;
  memberCount?: number;
  voiceStates?: GuildVoiceStates;
  members?: GuildMembers;
  channels?: GuildChannels;
  presences?: GuildPresences;
  maxPresences?: number;
  maxMembers?: number;
  vanityUrlCode?: string;
  description?: string;
  banner?: string;
  boostLevel?: number;
  boostCount?: number;
  preferredLocale?: string;
  systemUpdatesChannelId?: string;
  maxVideoChannelUsers?: number;
  approximateMemberCount?: number;
  approximatePresenceCount?: number;

  constructor(client: Client, guildData: GuildData) {
    this.client = client;
    this.id = guildData.id;
    this.available = !Boolean(guildData.unavailable);

    if (this.available) {
      this.afkChannelId = guildData.afk_channel_id;
      this.afkTimeout = guildData.afk_timeout;
      this.applicationId = guildData.application_id;
      this.approximateMemberCount = guildData.approximate_member_count;
      this.approximatePresenceCount = guildData.approximate_presence_count;
      this.banner = guildData.banner;
      this.boostCount = guildData.premium_subscription_count;
      this.boostLevel = guildData.premium_tier;
      if (guildData.channels) this.channels = new GuildChannels(client, ...guildData.channels);
      this.defaultMessageNotifications = guildData.default_message_notifications === 0 ? 'ALL_MESSAGES' : 'ONLY_MENTIONS';
      this.description = guildData.description;
      this.discoverySplash = guildData.discovery_splash;
      if (guildData.emojis) this.emojis = new GuildEmojis(client, guildData.id, ...guildData.emojis);
      this.explicitContentFilter = (['DISABLED', 'MEMBERS_WITHOUT_ROLES', 'ALL_MEMBERS'] as const)[guildData.explicit_content_filter || 0];
      this.features = guildData.features;
      this.icon = guildData.icon;
      this.joinedAt = new Date(guildData.joined_at!);
      this.large = guildData.large;
      this.maxMembers = guildData.max_members;
      this.maxPresences = guildData.max_presences;
      this.maxVideoChannelUsers = guildData.max_video_channel_users;
      this.memberCount = guildData.member_count;
      if (guildData.members) this.members = new GuildMembers(client, guildData.id, ...guildData.members);
      this.mfaEnabled = Boolean(guildData.mfa_level);
      this.name = guildData.name;
      this.ownerId = guildData.owner_id;
      this.owner = this.members?.get(this.ownerId);
      this.preferredLocale = guildData.preferred_locale;
      this.roles = new GuildRoles(...(guildData.roles || []));
      if (guildData.presences) this.presences = new GuildPresences(client, ...guildData.presences);
    }
  }

  get joinedTimestamp() {
    return this.joinedAt?.getTime();
  }

  get iconUrl() {
    return this.icon ? `${this.client.cdnBase}icons/${this.id}/${this.icon}.${this.icon.startsWith('a_' ? 'gif' : 'png')}` : null;
  }

  get splashUrl() {
    return this.splash ? `${this.client.cdnBase}splashes/${this.id}/${this.splash}.png` : null;
  }

  get discoverySplashUrl() {
    return this.discoverySplash ? `${this.client.cdnBase}discovery-splashes/${this.id}/${this.discoverySplash}.png` : null;
  }

  get bannerUrl() {
    return this.banner ? `${this.client.cdnBase}banners/${this.id}/${this.banner}.png` : null;
  }
}

export class GuildList extends List<string, Guild> {
  client: Client;

  constructor(client: Client, ...guilds: Guild[]) {
    super(...guilds);
    this.client = client;
  }
}