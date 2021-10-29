import {
  AttachmentData, InteractionType,
  MessageActivityData,
  MessageActivityType,
  MessageData, MessageInteractionData,
  MessageReactionData, MessageReferenceData, MessageType
} from '../types/index.ts';
import Client from '../client.ts';
import { Application, Channel, Emoji, Guild, Member, Role, User } from './models.ts';
import List from '../util/list.ts';
import { Thread } from './channel.ts';
import { MessageComponent } from './component.ts';
import { Embed } from './embed.ts';
import { StickerItem } from './sticker.ts';

class Attachment {
  client: Client;
  id: string;
  filename: string;
  contentType?: string;
  size: number;
  url: string;
  proxyUrl: string;
  height?: number;
  width?: number;
  constructor(client: Client, data: AttachmentData) {
    this.client = client;
    this.id = data.id;
    this.filename = data.filename;
    this.contentType = data.content_type;
    this.size = data.size;
    this.url = data.url;
    this.proxyUrl = data.proxy_url;
    this.height = data.height || undefined;
    this.width = data.width || undefined;
  }
}

class MessageReaction {
  client: Client;
  count: number;
  me: boolean;
  emoji: Emoji;
  constructor(client: Client, data: MessageReactionData) {
    this.client = client;
    this.count = data.count;
    this.me = data.me;
    this.emoji = new Emoji(client, null, data.emoji);
  }
}

class MessageActivity {
  client: Client;
  type: string;
  partyID?: string;

  constructor(client: Client, data: MessageActivityData) {
    this.client = client;
    this.type = MessageActivityType[data.type];
    this.partyID = data.party_id;
  }
}

class MessageReference {
  client: Client;
  messageID?: string;
  channelID?: string;
  guildID?: string;
  failIfNotExists?: boolean;

  constructor(client: Client, data: MessageReferenceData) {
    this.client = client;
    this.messageID = data.message_id;
    this.channelID = data.channel_id;
    this.guildID = data.guild_id;
    this.failIfNotExists = data.fail_if_not_exists;
  }

  get message(): Message|undefined { return this.messageID ? this.client.messages.get(this.messageID) : undefined; }
  get channel(): Channel|undefined { return this.channelID ? this.client.channels.get(this.channelID) : undefined; }
  get guild(): Guild|undefined { return this.guildID ? this.client.guilds.get(this.guildID) : undefined; }
}

export class Message {
  client: Client;

  id: string;
  channelID: string;
  guildID?: string;
  author: User;
  member?: Member;
  content: string;
  createdAt: Date;
  editedAt?: Date;
  tts: boolean;
  mentionEveryone: boolean;
  mentions: {
    members: List<string, User>;
    roles: List<string, Role>;
    channels: List<string, Channel>;
  };
  attachments: List<string, Attachment>;
  embeds: Embed[];
  reactions: MessageReaction[];
  nonce?: string;
  pinned: boolean;
  webhookID?: string;
  type: string;
  activity?: MessageActivity;
  application?: Application;
  applicationID?: string;
  messageReference?: MessageReference;
  flags?: string[];
  referencedMessage?: Message;
  interactions?: MessageInteraction;
  thread?: Thread;
  components?: MessageComponent[];
  stickers?: StickerItem[];

  constructor(client: Client, message: MessageData) {
    this.client = client;
    this.id = message.id;
    this.channelID = message.channel_id;
    this.guildID = message.guild_id;
    this.author = new User(client, message.author);
    this.member = message.guild_id && message.member ? new Member(client, message.guild_id, message.member) : undefined;
    this.content = message.content;
    this.createdAt = new Date(message.timestamp);
    this.editedAt = message.edited_timestamp ? new Date(message.edited_timestamp) : undefined;
    this.tts = message.tts;
    this.mentionEveryone = message.mention_everyone;
    this.mentions = {
      members: new List(...message.mentions.map(u => new User(client, u))),
      roles: new List(...this.guild!.roles!.filter((r: Role) => message.mention_roles?.some(role => r.id === role)).array()),
      channels: new List(...this.guild!.channels!.filter((c: Channel) => message.mention_channels?.some(ch => ch.id === c.id)).array())
    };
    this.attachments = new List(...message.attachments.map(a => new Attachment(client, a)));
    this.embeds = message.embeds.map(e => new Embed(client, e));
    this.reactions = message.reactions?.map(r => new MessageReaction(client, r)) || [];
    this.nonce = message.nonce?.toString();
    this.pinned = message.pinned;
    this.webhookID = message.webhook_id;
    this.type = MessageType[message.type];
    this.activity = message.activity ? new MessageActivity(client, message.activity) : undefined;
    this.application = message.application ? new Application(client, message.application) : undefined;
    this.applicationID = message.application_id;
    this.messageReference = message.message_reference ? new MessageReference(client, message.message_reference) : undefined;
    this.flags = message.flags ? [] : undefined;
    this.referencedMessage = message.referenced_message ? new Message(client, message.referenced_message) : undefined;
    this.interactions = message.interaction ? new MessageInteraction(client, message.interaction) : undefined;
    this.thread = message.thread ? new Thread(client, message.thread) : undefined;
    this.components = message.components?.map(c => new MessageComponent(client, c));
    this.stickers = message.sticker_items?.map(s => new StickerItem(client, s));
  }

  get createdTimestamp(): number { return this.createdAt.getTime(); }
  get editedTimestamp(): number|undefined { return this.editedAt?.getTime(); }
  get guild(): Guild { return this.client.guilds.get(this.guildID); }
  get channel(): Channel { return this.client.channels.get(this.channelID); }
}

export class MessageInteraction {
  client: Client;
  id: string;
  type: string;
  name: string;
  user: User;
  constructor(client: Client, data: MessageInteractionData) {
    this.client = client;
    this.id = data.id;
    this.type = InteractionType[data.type];
    this.name = data.name;
    this.user = new User(client, data.user);
  }
}


export class ChannelMessages {}
