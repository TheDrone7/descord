import { List } from '../util/util.ts';
import Client from '../client.ts';
import { RoleData } from '../types/index.ts';

export class Role {
  client: Client;
  private readonly guildId: string;
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  constructor(client: Client, guildId: string, role: RoleData) {
    this.client = client;
    this.guildId = guildId;
    this.id = role.id;
    this.name = role.name;
    this.color = role.color;
    this.hoist = role.hoist;
    this.position = role.position;
    this.permissions = role.permissions;
    this.managed = role.managed;
    this.mentionable = role.mentionable;
  }

  get createdTimestamp() { return parseInt(((BigInt(this.id) >> 22n) + 1420070400000n).toString()); }
  get createdAt() { return new Date(this.createdTimestamp); }

  get guild() { return this.client.guilds.get(this.guildId); }
}

export class GuildRoles extends List<string, Role>{
  client: Client;
  private readonly guildId: string;
  constructor(client: Client, guildId: string, ...roleData: RoleData[]) {
    super(...roleData.map(r => new Role(client, guildId, r)));
    this.client = client;
    this.guildId = guildId;
  }

  get guild() { return this.client.guilds.get(this.guildId); }
}

export class MemberRoles extends List<string, Role> {

  client: Client;
  private readonly guildId: string;
  constructor(client: Client, guildId: string, ...roleData: RoleData[]) {
    super(...roleData.map(r => new Role(client, guildId, r)));
    this.client = client;
    this.guildId = guildId;
  }

  get guild() { return this.client.guilds.get(this.guildId); }
}