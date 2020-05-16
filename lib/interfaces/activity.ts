import { ActivityType } from '../struct.ts';
export default interface Activity {
  name: string;
  type: ActivityType;
  url?: string;
}
