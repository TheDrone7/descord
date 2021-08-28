import { UserData } from './user.ts';
import { ApplicationData } from './application.ts';

export interface IntegrationData {
  id: string;
  name: string;
  type: string;
  enabled?: boolean;
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
  application?: ApplicationData
}