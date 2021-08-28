import { UserData } from './user.ts';
import { WebhookData } from './webhook.ts';
import { IntegrationData } from './integration.ts';

export enum AuditLogEvent {
  'GUILD_UPDATE' = 1,
  'CHANNEL_CREATE' = 10,
  'CHANNEL_UPDATE',
  'CHANNEL_DELETE',
  'CHANNEL_OVERWRITE_CREATE',
  'CHANNEL_OVERWRITE_UPDATE',
  'CHANNEL_OVERWRITE_DELETE',
  'MEMBER_KICK' = 20,
  'MEMBER_PRUNE',
  'MEMBER_BAN_ADD',
  'MEMBER_BAN_REMOVE',
  'MEMBER_UPDATE',
  'MEMBER_ROLE_UPDATE',
  'MEMBER_MOVE',
  'MEMBER_DISCONNECT',
  'BOT_ADD',
  'ROLE_CREATE' = 30,
  'ROLE_UPDATE',
  'ROLE_DELETE',
  'INVITE_CREATE' = 40,
  'INVITE_UPDATE',
  'INVITE_DELETE',
  'WEBHOOK_CREATE' = 50,
  'WEBHOOK_UPDATE',
  'WEBHOOK_DELETE',
  'EMOJI_CREATE' = 60,
  'EMOJI_UPDATE',
  'EMOJI_DELETE',
  'MESSAGE_DELETE' = 72,
  'MESSAGE_BULK_DELETE',
  'MESSAGE_PIN',
  'MESSAGE_UNPIN',
  'INTEGRATION_CREATE' = 80,
  'INTEGRATION_UPDATE',
  'INTEGRATION_DELETE',
  'STAGE_INSTANCE_CREATE',
  'STAGE_INSTANCE_UPDATE',
  'STAGE_INSTANCE_DELETE',
}

export interface AuditLogChangeData {
  new_value: any;
  old_value: any;
  key: string;
}

export interface OptionalAuditEntryData {
  delete_member_days?: string;
  members_removed?: string;
  channel_id?: string;
  message_id?: string;
  count?: string;
  id?: string;
  type?: string;
  role_name?: string;
}

export interface AuditLogEntryData {
  target_id: string|null;
  changes?: AuditLogChangeData[];
  user_id: string|null;
  id: string;
  action_type: AuditLogEvent;
  options?: OptionalAuditEntryData;
  reason?: string;
}

export interface AuditData  {
  webhooks: WebhookData[];
  users: UserData[];
  audit_log_entries: AuditLogEntryData[];
  integrations: IntegrationData[];
}