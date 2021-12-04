import {
  DefaultMessageNotificationLevel,
  ExplicitContentFilterLevel,
  GuildData, GuildNSFWLevel, PremiumTier,
  VerificationLevel
} from '../types/index.ts';
import Client from '../client.ts';
import {
  Channel,
  GuildChannels,
  GuildEmojis,
  GuildMembers,
  GuildPresences,
  GuildRoles,
  GuildVoiceStates, Integration,
  Member, VoiceChannel,
  GuildScheduledEvent
} from './models.ts';
import List from '../util/list.ts';
import { StageInstance } from './stageInstance.ts';
import { GuildStickers } from './sticker.ts';

export class Guild {
  readonly client: Client;

  readonly id: string;
  readonly available: boolean;
  name?: string;
  icon?: string;
  splash?: string;
  discoverySplash?: string;
  ownerID?: string;
  afkChannelID?: string;
  afkTimeout?: number;
  widgetEnabled?: boolean;
  widgetChannelID?: string;
  verificationLevel?: string;
  defaultMessageNotifications?: string;
  explicitContentFilter?: string;
  roles?: GuildRoles;
  emojis?: GuildEmojis;
  features?: string[];
  mfaEnabled?: boolean;
  applicationID?: string;
  systemChannelID?: string;
  systemChannelFlags?: string[];
  rulesChannelID?: string;
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
  boostLevel?: PremiumTier;
  boostCount?: number;
  preferredLocale?: string;
  maxVideoChannelUsers?: number;
  approximateMemberCount?: number;
  approximatePresenceCount?: number;
  welcomeScreen?: {
    description?: string;
    channels: ({
      id: string;
      description: string;
      emojiID?: string;
      emojiName?: string;
    })[];
  };
  nsfwLevel?: string;
  stageInstances?: StageInstance[];
  stickers?: GuildStickers;
  integrations?: List<string, Integration>;
  events?: List<string, GuildScheduledEvent>
  nitroBarEnabled?: boolean;

  constructor(client: Client, guildData: GuildData) {
    this.client = client;
    this.id = guildData.id;
    this.available = !Boolean(guildData.unavailable);

    if (this.available) {
      this.name = guildData.name;
      this.icon = guildData.icon || undefined;
      this.splash = guildData.splash || undefined;
      this.discoverySplash = guildData.discovery_splash || undefined;
      this.ownerID = guildData.owner_id;
      this.afkChannelID = guildData.afk_channel_id || undefined;
      this.afkTimeout = guildData.afk_timeout || 0;
      this.widgetEnabled = guildData.widget_enabled;
      this.widgetChannelID = guildData.widget_channel_id || undefined;
      this.verificationLevel = guildData.verification_level ? VerificationLevel[guildData.verification_level] : undefined;
      this.defaultMessageNotifications = guildData.default_message_notifications ? DefaultMessageNotificationLevel[guildData.default_message_notifications] : undefined;
      this.explicitContentFilter = guildData.explicit_content_filter ? ExplicitContentFilterLevel[guildData.explicit_content_filter] : undefined;
      this.roles = new GuildRoles(client, guildData.id, ...(guildData.roles || []));
      this.emojis = new GuildEmojis(client, guildData.id, ...(guildData.emojis || []));
      this.features = guildData.features;
      this.mfaEnabled = Boolean(guildData.mfa_level);
      this.applicationID = guildData.application_id || undefined;
      this.systemChannelID = guildData.system_channel_id || undefined;
      this.systemChannelFlags = [];
      this.rulesChannelID = guildData.rules_channel_id || undefined;
      if (guildData.joined_at) this.joinedAt = new Date(guildData.joined_at!);
      this.large = guildData.large;
      this.memberCount = guildData.member_count;
      this.voiceStates = new GuildVoiceStates(client, ...(guildData.voice_states || []));
      this.members = new GuildMembers(client, guildData.id, ...(guildData.members || []));
      this.channels = new GuildChannels(client, ...(guildData.channels || []));
      this.presences = new GuildPresences(client, ...(guildData.presences || []));
      this.maxPresences = guildData.max_presences || undefined;
      this.maxMembers = guildData.max_members;
      this.vanityUrlCode = guildData.vanity_url_code || undefined;
      this.description = guildData.description || undefined;
      this.banner = guildData.banner || undefined;
      this.boostLevel = guildData.premium_tier;
      this.boostCount = guildData.premium_subscription_count;
      this.preferredLocale = guildData.preferred_locale;
      this.maxVideoChannelUsers = guildData.max_video_channel_users;
      this.approximateMemberCount = guildData.approximate_member_count;
      this.approximatePresenceCount = guildData.approximate_presence_count;
      this.integrations = new List();
      this.events = new List(...(guildData.guild_scheduled_events?.map(e => new GuildScheduledEvent(client, e)) || []));
      this.nitroBarEnabled = guildData.premium_progress_bar_enabled;

      this.welcomeScreen = {
        description: guildData.welcome_screen?.description || undefined,
        channels: (guildData.welcome_screen?.welcome_channels || []).map(c => ({
          id: c.channel_id,
          description: c.description,
          emojiID: c.emoji_id || undefined,
          emojiName: c.emoji_name || undefined
        }))
      };

      this.nsfwLevel = guildData.nsfw_level ? GuildNSFWLevel[guildData.nsfw_level] : undefined;
      this.stageInstances = guildData.stage_instances?.map(i => new StageInstance(client, i));
      this.stickers = new GuildStickers(client, ...(guildData.stickers || []));

      if (guildData.system_channel_flags) {
        if ((guildData.system_channel_flags & (1 << 0)) === (1 << 0)) this.systemChannelFlags?.push('SUPPRESS_JOIN_NOTIFICATIONS');
        if ((guildData.system_channel_flags & (1 << 1)) === (1 << 1)) this.systemChannelFlags?.push('SUPPRESS_PREMIUM_SUBSCRIPTIONS');
        if ((guildData.system_channel_flags & (1 << 2)) === (1 << 2)) this.systemChannelFlags?.push('SUPPRESS_GUILD_REMINDER_NOTIFICATIONS');
      }
    }
  }

  get joinedTimestamp(): number|undefined { return this.joinedAt?.getTime(); }
  get owner(): Member|undefined { return this.members?.get(this.ownerID); }
  get afkChannel(): VoiceChannel|undefined { return this.channels?.get(this.afkChannelID); }
  get widgetChannel(): Channel|undefined { return this.channels?.get(this.widgetChannelID); }
  get systemChannel(): Channel|undefined { return this.channels?.get(this.systemChannelID); }
  get rulesChannel(): Channel|undefined { return this.channels?.get(this.rulesChannelID); }
  get vanityUrl(): string|undefined { return this.vanityUrlCode ? `https://discord.gg/${this.vanityUrlCode}` : undefined; }

  get iconUrl(): string|undefined {
    return this.icon ? `${this.client.cdnBase}icons/${this.id}/${this.icon}.${this.icon.startsWith('a_' ? 'gif' : 'png')}` : undefined;
  }

  get splashUrl(): string|undefined {
    return this.splash ? `${this.client.cdnBase}splashes/${this.id}/${this.splash}.png` : undefined;
  }

  get discoverySplashUrl(): string|undefined {
    return this.discoverySplash ? `${this.client.cdnBase}discovery-splashes/${this.id}/${this.discoverySplash}.png` : undefined;
  }

  get bannerUrl(): string|undefined {
    return this.banner ? `${this.client.cdnBase}banners/${this.id}/${this.banner}.png` : undefined;
  }
}

export class GuildList extends List<string, Guild> {
  client: Client;

  constructor(client: Client, ...guilds: Guild[]) {
    super(...guilds);
    this.client = client;
  }
}