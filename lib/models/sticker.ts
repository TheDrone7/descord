import Client from '../client.ts';
import { StickerData, StickerFormat, StickerItemData, StickerPackData, StickerType } from '../types/index.ts';
import { User } from './user.ts';
import List from '../util/list.ts';
import { Guild } from './guild.ts';

export class Sticker {
  client: Client;
  id: string;
  packID?: string;
  name: string;
  description?: string;
  tags: string;
  type: string;
  format: string;
  available?: boolean;
  guildID?: string;
  user?: User;
  sortValue?: number;

  constructor(client: Client, data: StickerData) {
    this.client = client;
    this.id = data.id;
    this.packID = data.pack_id;
    this.name = data.name;
    this.description = data.description || undefined;
    this.tags = data.tags;
    this.type = StickerType[data.type];
    this.format = StickerFormat[data.format_type];
    this.available = data.available;
    this.guildID = data.guild_id;
    this.user = data.user ? new User(client, data.user) : undefined;
    this.sortValue = data.sort_value;
  }

  get guild(): Guild|undefined {
    return this.guildID ?  this.client.guilds.get(this.guildID) : undefined;
  }

  get url(): string {
    return `${this.client.cdnBase}stickers/${this.id}.${this.format === 'LOTTIE' ? 'json' : 'png'}`
  }
}

export class StickerItem {
  client: Client;
  id: string;
  name: string;
  format: string;

  constructor(client: Client, data: StickerItemData) {
    this.client = client;
    this.id = data.id;
    this.name = data.name;
    this.format = StickerFormat[data.format_type];
  }

  get url(): string {
    return `${this.client.cdnBase}stickers/${this.id}.${this.format === 'LOTTIE' ? 'json' : 'png'}`
  }

  get full(): Sticker|undefined {
    return this.client.stickers.get(this.id)
  }
}

export class StickerPack {
  client: Client;
  id: string;
  stickers: List<string, Sticker>
  name: string;
  skuID: string;
  coverStickerID?: string;
  description: string;
  bannerAssetID: string;
  constructor(client: Client, data: StickerPackData) {
    this.client = client;
    this.id = data.id;
    this.stickers = new List(...data.stickers.map(s => new Sticker(client, s)));
    this.name = data.name;
    this.coverStickerID = data.cover_sticker_id;
    this.skuID = data.sku_id;
    this.description = data.description;
    this.bannerAssetID = data.banner_asset_id;
  }

  coverSticker(): Sticker|undefined {
    return this.coverStickerID ? this.stickers.get(this.coverStickerID) : undefined;
  }

  bannerAssetUrl(): string {
    return `${this.client.cdnBase}app-assets/710982414301790216/store/${this.bannerAssetID}.png`;
  }
}

export class GuildStickers extends List<string, Sticker> {
  client: Client;

  constructor(client: Client, ...stickers: StickerData[]) {
    super(...stickers.map(s => new Sticker(client, s)));
    this.client = client;
  }
}