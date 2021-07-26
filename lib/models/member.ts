import { GuildMemberData, Permission, Permissions } from '../types/index.ts';
import Client from '../client.ts';
import { List } from '../util/util.ts';
import { MemberRoles, Role, User } from './models.ts';

export class Member {
  client: Client;
  user?: User;
  nickname?: string;
  roleIds: string[];
  joinedAt: Date;
  boostingSince?: Date;
  isDeafened: boolean;
  isMuted: boolean;
  pending?: boolean;
  permissions: Permission[];
  guildId: string;

  constructor(client: Client, guildId: string, member: GuildMemberData) {
    this.client = client;
    this.guildId = guildId;
    if (member.user) this.user =  new User(client, member.user);
    this.nickname = member.nick || undefined;
    this.roleIds = member.roles || [];
    this.joinedAt = new Date(member.joined_at);
    this.boostingSince = member.premium_since ? new Date(member.premium_since) : undefined;
    this.isDeafened = member.deaf;
    this.isMuted = member.mute;
    this.pending = member.pending;
    this.permissions = [];

    if (member.permissions) {
      const permissionsBit = parseInt(member.permissions);
      for (let bits in Object.keys(Permissions)) {
        let bit = parseInt(bits);
        if ((permissionsBit & bit) === bit) this.permissions.push(Permissions[bits]);
      }
    }
  }

  get displayName() { return this.nickname !== null ? this.nickname : this.user?.username; }
  get joinedTimestamp() { return this.joinedAt.getTime(); }
  get guild() { return this.client.guilds.get(this.guildId); }
  get roles() { return new MemberRoles(this.client, this.guildId, this.guild.roles.filter((r: Role) => this.roleIds.includes(r.id))); }
}

export class GuildMembers extends List<string, Member> {
  client: Client;

  constructor(client: Client, guildId: string, ...memberData: GuildMemberData[]) {
    super(...memberData.map(m => new Member(client, guildId, m)));
    this.client = client;
  }
}