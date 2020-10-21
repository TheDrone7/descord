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