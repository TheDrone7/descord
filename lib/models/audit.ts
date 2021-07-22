import { Webhook } from './webhook.ts';
import { User } from './user.ts';
import { AuditData, AuditLogChangeData, AuditLogEntryData, AuditLogEvent, OptionalAuditEntryData } from '../types/index.ts';
import Client from '../client.ts';
import { Integration } from './integration.ts';

export class AuditLogChange {
  client: Client;
  newValue: any;
  oldValue: any;
  key: string;

  constructor(client: Client, data: AuditLogChangeData) {
    this.client = client;
    this.newValue = data.new_value;
    this.oldValue = data.old_value;
    this.key = data.key;
  }
}

export class OptionalAuditEntry {
  client: Client;

  deleteMemberDays?: string;
  membersRemoved?: string;
  channelID?: string;
  messageID?: string;
  count?: string;
  id?: string;
  type?: string;
  roleName?: string;

  constructor(client: Client, data: OptionalAuditEntryData) {
    this.client = client;

    this.deleteMemberDays = data.delete_member_days;
    this.membersRemoved = data.members_removed;
    this.channelID = data.channel_id;
    this.messageID = data.message_id;
    this.count = data.count;
    this.id = data.id;
    this.type = data.type;
    this.roleName = data.role_name;
  }
}

export class AuditLogEntry {
  client: Client;
  targetId?: string;
  changes: AuditLogChange[];
  userId?: string;
  id: string;
  actionType: string;
  options?: OptionalAuditEntry;
  reason?: string;

  constructor(client: Client, auditLog: AuditLogEntryData) {
    this.client = client;
    if (auditLog.target_id !== null) this.targetId = auditLog.target_id;
    this.changes = [];
    if (auditLog.user_id !== null) this.userId = auditLog.user_id;
    this.id = auditLog.id;
    this.actionType = AuditLogEvent[auditLog.action_type];
    this.reason = auditLog.reason;
  }
}

export class Audit {
  client: Client;
  webhooks: Webhook[];
  users: User[];
  auditLogs: AuditLogEntry[];
  integrations: Integration[];

  constructor(client: Client, audit: AuditData) {
    this.client = client;
    this.webhooks = audit.webhooks.map(w => new Webhook(client, w));
    this.users = audit.users.map(u => new User(client, u));
    this.auditLogs = audit.audit_log_entries.map(l => new AuditLogEntry(client, l));
    this.integrations = audit.integrations.map(i => new Integration(client, i));
  }
}