import { Activity, Presence, PresenceStatus } from './types.ts';

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
    premium_type?: 0 | 1 | 2;
}

export interface Overwrite {
    id: string;
    type: 0 | 1;
    allow: string;
    deny: string;
}

export interface ChannelData {
    id: string;
    type: number;
    guild_id?: string;
    position?: number;
    permission_overwrites?: Overwrite[];
    name?: string;
    topic?: string | null;
    nsfw?: boolean;
    last_message_id?: string | null;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: UserData[];
    icon?: string | null;
    owner_id?: string;
    application_id?: string;
    parent_id?: string | null;
    last_pin_timestamp?: string | null;
}

export interface EmojiData {
    id: string;
    name: string;
    roles?: string[];
    user?: UserData;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}

export interface RoleData {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    position: number;
    permissions: string;
    managed: boolean;
    mentionable: boolean;
}

export interface VoiceStateData {
    guild_id?: string;
    channel_id: string|null;
    user_id: string;
    member?: GuildMemberData;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
}

export interface GuildMemberData {
    user: UserData;
    nick: string | null;
    roles: string[];
    joined_at: string;
    premium_since: string | null;
    deaf: boolean;
    mute: boolean;
}

export interface GuildData {
    id: string;
    unavailable?: boolean;
    name?: string;
    icon?: string;
    splash?: string;
    discovery_splash?: string;
    owner_id?: string;
    region?: string;
    afk_channel_id?: string;
    afk_timeout?: number;
    widget_enabled?: boolean;
    widget_channel_id?: string;
    verification_level?: number;
    default_message_notifications?: number;
    explicit_content_filter?: number;
    roles?: RoleData[];
    emojis?: EmojiData[];
    features?: ('INVITE_SPLASH' | 'VIP_REGIONS' | 'VANITY_URL' | 'VERIFIED' | 'PARTNERED' | 'COMMUNITY' | 'COMMERCE' | 'NEWS' | 'DISCOVERABLE' | 'FEATURABLE' | 'ANIMATED_ICON' | 'BANNER' | 'WELCOME_SCREEN_ENABLED')[];
    mfa_level?: number;
    application_id?: string;
    system_channel_id?: string;
    system_channel_flags?: number;
    rules_channel_id?: string;
    joined_at?: string;
    large?: boolean;
    member_count?: number;
    voice_states?: VoiceStateData[];
    members?: GuildMemberData[];
    channels?: ChannelData[];
    presences?: PresenceUpdate[];
    max_presences?: number;
    max_members?: number;
    vanity_url_code?: string;
    description?: string;
    banner?: string;
    premium_tier?: number;
    premium_subscription_count?: number;
    preferred_locale?: string;
    public_updates_channel_id?: string;
    max_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
}

export interface GuildIntegrations {
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    syncing: boolean;
    role_id: boolean;
    enable_emoticons?: boolean;
    expire_behavior: number;
    expire_grace_period: number;
    user?: UserData;
    account: IntegrationAccountData;
    synced_at: string;
    subscriber_count: number;
    revoked: boolean;
    application?: ApplicationData;
}

export interface IntegrationAccountData {
    id: string;
    name: string;
}

export interface PresenceUpdate {
    user: UserData;
    guild_id: string;
    status: PresenceStatus;
    activities: Activity[];
    client_status: {
        desktop?: PresenceStatus;
        mobile?: PresenceStatus;
        web?: PresenceStatus;
    };
}

export interface ApplicationData {
    id: string;
    name: string;
    icon: string | null;
    description: string;
    summary: string;
    bot?: UserData;
}