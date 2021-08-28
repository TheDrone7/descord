import { UserData } from './user.ts';

export type MembershipState = 'INVITED' | 'ACCEPTED';

export interface TeamData {
  icon: string|null;
  id: string;
  members: TeamMemberData[];
  name: string;
  owner_user_id: string;
}

export interface TeamMemberData {
  membership_state: 1 | 2;
  permissions: string[];
  team_id: string;
  user: UserData;
}