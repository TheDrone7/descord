import { AuditData, AuditLogChangeData, AuditLogEntryData, AuditLogEvent, OptionalAuditEntryData } from '../types/index.ts';
import Client from '../client.ts';
import { Webhook } from './webhook.ts';
import { User } from './user.ts';
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

  get channel() { return this.channelID ? this.client.channels.get(this.channelID) : undefined; }
  get message() { return this.messageID ? this.client.messages.get(this.messageID) : undefined; }
}

export class AuditLogEntry {
  client: Client;
  targetID?: string;
  changes: AuditLogChange[];
  userID?: string;
  id: string;
  actionType: string;
  options?: OptionalAuditEntry;
  reason?: string;

  constructor(client: Client, auditLog: AuditLogEntryData) {
    this.client = client;
    this.targetID = auditLog.target_id || undefined;
    this.changes = [];
    this.userID = auditLog.user_id || undefined;
    this.id = auditLog.id;
    this.actionType = AuditLogEvent[auditLog.action_type];
    this.reason = auditLog.reason;
    this.options = auditLog.options ? new OptionalAuditEntry(client, auditLog.options) : undefined;
  }

  get user() { return this.userID ? this.client.users.get(this.userID) : undefined; }
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