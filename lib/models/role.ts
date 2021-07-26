import { RoleData, RoleTagData } from '../types/index.ts';
import Client from '../client.ts';
import { List } from '../util/util.ts';

export class RoleTag {
  client: Client;
  botID?: string;
  integrationID?: string;
  premiumSubscriber?: null;
  constructor(client: Client, data: RoleTagData) {
    this.client = client;
    this.botID = data.bot_id;
    this.integrationID = data.integration_id;
    this.premiumSubscriber = data.premium_subscriber;
  }
}

export class Role {
  client: Client;
  guildID: string;
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags?: RoleTag;
  constructor(client: Client, guildId: string, role: RoleData) {
    this.client = client;
    this.guildID = guildId;
    this.id = role.id;
    this.name = role.name;
    this.color = role.color;
    this.hoist = role.hoist;
    this.position = role.position;
    this.permissions = role.permissions;
    this.managed = role.managed;
    this.mentionable = role.mentionable;
    this.tags = role.tags ? new RoleTag(client, role.tags) : undefined;
  }

  get createdTimestamp() { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
  get createdAt() { return new Date(this.createdTimestamp); }

  get guild() { return this.client.guilds.get(this.guildID); }
}

export class GuildRoles extends List<string, Role>{
  client: Client;
  guildID: string;
  constructor(client: Client, guildId: string, ...roleData: RoleData[]) {
    super(...roleData.map(r => new Role(client, guildId, r)));
    this.client = client;
    this.guildID = guildId;
  }

  get guild() { return this.client.guilds.get(this.guildID); }
}

export class MemberRoles extends List<string, Role> {

  client: Client;
  guildID: string;
  constructor(client: Client, guildId: string, ...roleData: RoleData[]) {
    super(...roleData.map(r => new Role(client, guildId, r)));
    this.client = client;
    this.guildID = guildId;
  }

  get guild() { return this.client.guilds.get(this.guildID); }
}