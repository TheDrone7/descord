import Client from '../client.ts';
import { List } from '../util/util.ts';
import { User, MemberRoles } from './models.ts';

export class Member extends User {
    user?: User;
    nickname: string | null;
    roles: MemberRoles;
    joinedAt: Date;
    boostingSince?: Date;
    isDeafened: boolean;
    isMuted: boolean;

    constructor(client: Client, member: any) {
        super(client, member.user);
        this.user = member.user ? new User(client, member.user) : undefined;
        this.nickname = member.nick;
        this.roles = new MemberRoles(...member.roles);
        this.joinedAt = new Date(member.joined_at);
        this.boostingSince = member.premium_since ? new Date(member.premium_since) : undefined;
        this.isDeafened = member.deaf;
        this.isMuted = member.mute;
    }

    get joinedTimestamp() {
        return this.joinedAt.getTime();
    }
}

export class GuildMembers extends List<string, Member> {
}