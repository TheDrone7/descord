import { UserData } from './user.ts';

export enum StickerType {
  STANDARD = 1,
  GUILD
}

export enum StickerFormat {
  PNG = 1,
  APNG,
  LOTTIE
}

export interface StickerData {
  id: string;
  pack_id?: string;
  name: string;
  description: string|null;
  tags: string;
  type: StickerType;
  format_type: StickerFormat;
  available?: boolean;
  guild_id?: string;
  user?: UserData;
  sort_value?: number;
}

export interface StickerItemData {
  id: string;
  name: string;
  format_type: StickerFormat;
}

export interface StickerPackData {
  id: string;
  stickers: StickerData[];
  name: string;
  sku_id: string;
  cover_sticker_id?: string;
  description: string;
  banner_asset_id: string;
}