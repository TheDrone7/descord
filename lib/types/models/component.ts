import { EmojiData } from './emoji.ts';

export enum MessageComponentType {
  'Action Row' = 1,
  'Button',
  'Select Menu'
}

export enum ButtonStyle {
  'Primary' = 1,
  'Secondary',
  'Success',
  'Danger',
  'Link'
}

export interface SelectOptionsData {
  label: string;
  value: string;
  description?: string;
  emoji?: EmojiData;
  default?: boolean;
}

export interface MessageComponentData {
  type: MessageComponentType;
  custom_id?: string;
  disabled?: boolean;
  style?: ButtonStyle;
  label?: string;
  emoji?: EmojiData;
  url?: string;
  options?: SelectOptionsData[];
  placeholder?: string;
  min_values?: number;
  max_values?: number;
  components?: MessageComponentData[];
}