import { UserData } from './user.ts';

export interface IntegrationData {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  syncing?: boolean;
  role_id?: string;
  enable_emoticons?: boolean;
  expire_behavior?: 0|1;
  expire_grace_period?: number;
  user?: UserData;
  account: { id: string; name: string; };
  synced_at?: string;
  subscriber_count?: number;
  revoked?: boolean;
  application?: {
    id: string;
    name: string;
    icon: string|null;
    description: string;
    summary: string;
    bot?: UserData;
  }
}