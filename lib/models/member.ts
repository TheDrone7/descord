import { GuildMemberData, Permission, Permissions, PresenceUpdate, ThreadMemberData } from '../types/index.ts';
import Client from '../client.ts';
import { List } from '../util/util.ts';
import { Guild, MemberRoles, Role, Thread, User, UserPresence } from './models.ts';

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
  permissions: string[];
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
      for (const bits of Object.keys(Permissions)) {
        let bit = parseInt(bits);
        if ((permissionsBit & bit) === bit) this.permissions.push(Object.values(Permissions)[Object.keys(Permissions).indexOf(bits)]);
      }
    }
  }

  get displayName(): string|undefined { return this.nickname !== null ? this.nickname : this.user?.username; }
  get joinedTimestamp(): number { return this.joinedAt.getTime(); }
  get guild(): Guild { return this.client.guilds.get(this.guildId); }
  get roles(): MemberRoles { return new MemberRoles(this.client, this.guildId, ...this.guild.roles!.filter((r: Role) => this.roleIds.includes(r.id)).array()); }
}

export class ThreadMember {
  client: Client;
  presence?: UserPresence;
  member: Member;
  joinedAt: Date;
  threadID: string;
  flags: number;
  constructor(client: Client, guildID: string, data: ThreadMemberData) {
    this.client = client;
    this.presence = data.presence ? new UserPresence(client, data.presence) : undefined;
    this.member = new Member(client, guildID, data.member);
    this.joinedAt = new Date(data.join_timestamp);
    this.threadID = data.id;
    this.flags = data.flags;
  }

  get thread(): Thread|undefined {
    return this.client.channels.get(this.threadID);
  }
}

export class GuildMembers extends List<string, Member> {
  client: Client;

  constructor(client: Client, guildId: string, ...memberData: GuildMemberData[]) {
    super(...memberData.map(m => new Member(client, guildId, m)));
    this.client = client;
  }
}