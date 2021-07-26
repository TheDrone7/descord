import { EmbedData } from '../types/index.ts';
import Client from '../client.ts';

export class Embed {
  client: Client;

  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: Date;
  color?: number;
  footer?: { text: string; iconURL?: string; proxyIconURL?: string; };
  image?: { url?: string; proxyURL?: string; height?: number; width?: number; };
  thumbnail?: { url?: string; proxyURL?: string; height?: number; width?: number; };
  video?: { url?: string; proxyURL?: string; height?: number; width?: number; };
  provider?: { name?: string; url?: string; };
  author?: { name?: string; url?: string; iconURL?: string; proxyIconURL?: string; };
  fields: { name: string; value: string; inline?: boolean; }[];
  constructor(client: Client, data: EmbedData) {
    this.client = client;
    this.title = data.title;
    this.type = data.type;
    this.description = data.description;
    this.url = data.url;
    this.timestamp = data.timestamp ? new Date(data.timestamp) : undefined;
    this.color = data.color;
    this.footer = data.footer ? {
      text: data.footer.text,
      iconURL: data.footer.icon_url,
      proxyIconURL: data.footer.proxy_icon_url
    } : undefined;
    this.image = data.image ? {
      url: data.image.url,
      proxyURL: data.image.proxy_url,
      height: data.image.height,
      width: data.image.width
    } : undefined;
    this.thumbnail = data.thumbnail ? {
      url: data.thumbnail.url,
      proxyURL: data.thumbnail.proxy_url,
      height: data.thumbnail.height,
      width: data.thumbnail.width
    } : undefined;
    this.video = data.video ? {
      url: data.video.url,
      proxyURL: data.video.proxy_url,
      height: data.video.height,
      width: data.video.width
    } : undefined;
    this.provider = data.provider ? {
      name: data.provider.name,
      url: data.provider.url
    } : undefined;
    this.author = data.author ? {
      name: data.author.name,
      url: data.author.url,
      iconURL: data.author.icon_url,
      proxyIconURL: data.author.proxy_icon_url
    } : undefined;
    this.fields = data.fields;
  }
}