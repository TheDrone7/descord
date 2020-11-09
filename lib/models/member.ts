import Client from '../client.ts';
import { List } from '../util/util.ts';
import { MemberRoles, User } from './models.ts';
import { GuildMemberData } from '../types/modelData.ts';

export class Member extends User {
  user: User;
  nickname: string | null;
  roles: MemberRoles;
  joinedAt: Date;
  boostingSince?: Date;
  isDeafened: boolean;
  isMuted: boolean;

  constructor(client: Client, member: GuildMemberData) {
    super(client, member.user);
    this.user = new User(client, member.user);
    this.nickname = member.nick;
    this.roles = new MemberRoles(...member.roles);
    this.joinedAt = new Date(member.joined_at);
    this.boostingSince = member.premium_since ? new Date(member.premium_since) : undefined;
    this.isDeafened = member.deaf;
    this.isMuted = member.mute;
  }

  get displayName() {
    return this.nickname !== null ? this.nickname : this.username;
  }

  get joinedTimestamp() {
    return this.joinedAt.getTime();
  }
}

export class GuildMembers extends List<string, Member> {
  client: Client;

  constructor(client: Client, ...memberData: GuildMemberData[]) {
    super(...memberData.map(m => new Member(client, m)));
    this.client = client;
  }
}