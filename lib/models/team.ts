import { TeamData, MembershipState, TeamMemberData } from '../types/index.ts';
import { User } from './user.ts';
import Client from '../client.ts';

export class TeamMember {
  client: Client;
  membershipState: MembershipState;
  permissions: string[];
  teamID: string;
  user: User;

  constructor(client: Client, teamMember: TeamMemberData) {
    this.client = client;
    this.membershipState = teamMember.membership_state === 1 ? 'INVITED': 'ACCEPTED';
    this.permissions = teamMember.permissions;
    this.teamID = teamMember.team_id;
    this.user = new User(client, teamMember.user);
  }
}

export class Team {
  client: Client;

  icon: string|null;
  id: string;
  members: TeamMember[];
  name: string;
  ownerID: string;

  constructor(client: Client, team: TeamData) {
    this.client = client;
    this.icon = team.icon;
    this.id = team.id;
    this.members = team.members.map(m => new TeamMember(client, m));
    this.name = team.name;
    this.ownerID = team.owner_user_id;
  }

  get iconURL() {
    return this.icon === null ? null : this.client.cdnBase + `team-icons/${this.id}/${this.icon}.png`;
  }

  get owner(): TeamMember {
    return this.members.find(m => m.user.id === this.ownerID)!;
  }
}