export interface UserData {
    id: string;
    username?: string;
    discriminator?: string;
    avatar?: string|null;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    locale?: string;
    flags?: number;
    premium_type: 0|1|2;
}

export interface ChannelData {

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
    roles?: any[];
    emojis?: any[];
    features?: ('INVITE_SPLASH' | 'VIP_REGIONS' | 'VANITY_URL' | 'VERIFIED' | 'PARTNERED' | 'COMMUNITY' | 'COMMERCE' | 'NEWS' | 'DISCOVERABLE' | 'FEATURABLE' | 'ANIMATED_ICON' | 'BANNER' | 'WELCOME_SCREEN_ENABLED')[];
    mfa_level?: number;
    application_id?: string;
    system_channel_id?: string;
    system_channel_flags?: number;
    rules_channel_id?: string;
    joined_at?: string;
    large?: boolean;
    member_count?: number;
    voice_states?: any[];
    members?: any[];
    channels?: any[];
    presences?: any[];
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