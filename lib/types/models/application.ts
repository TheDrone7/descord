import { UserData } from './user.ts';
import { TeamData } from './team.ts';

export type ApplicationFlag = 'GATEWAY_PRESENCE' | 'GATEWAY_PRESENCE_LIMITED' | 'GATEWAY_GUILD_MEMBERS' | 'GATEWAY_GUILD_MEMBERS_LIMITED' | 'VERIFICATION_PENDING_GUILD_LIMIT' | 'EMBEDDED';

export interface ApplicationData {
  id: string;
  name: string;
  icon: null|string;
  description: string;
  rpc_origins?: string[];
  bot_public: boolean;
  bot_require_code_grant: boolean;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  owner?: UserData;
  summary: string;
  verify_key: string;
  team: null|TeamData;
  guild_id?: string;
  primary_sku_id?: string;
  slug?: string;
  cover_image?: string;
  flags?: number;
}