export interface EmbedFooterData {
  text: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedImageData {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedThumbnailData {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedVideoData {
  url?: string;
  proxy_url?: string;
  height?: number;
  width?: number;
}

export interface EmbedProviderData {
  name?: string;
  url?: string;
}

export interface EmbedAuthorData {
  name?: string;
  url?: string;
  icon_url?: string;
  proxy_icon_url?: string;
}

export interface EmbedFieldData {
  name: string;
  value: string;
  inline?: boolean;
}

export interface EmbedData {
  title?: string;
  type?: string;
  description?: string;
  url?: string;
  timestamp?: string;
  color?: number;
  footer?: EmbedFooterData;
  image?: EmbedImageData;
  thumbnail?: EmbedThumbnailData;
  video?: EmbedVideoData;
  provider?: EmbedProviderData;
  author: EmbedAuthorData;
  fields: EmbedFieldData[];
}