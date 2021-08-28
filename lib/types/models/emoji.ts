import { UserData } from './user.ts';

export interface EmojiData {
  id: string|null;
  name: string|null;
  roles?: string[];
  user?: UserData;
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  available?: boolean;
}