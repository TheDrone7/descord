import Activity from './activity.ts';
export default interface Presence {
  since?: number;
  game?: Activity;
  status: 'online' | 'idle' | 'dnd' | 'offline' | 'invisible';
  afk?: boolean;
}
