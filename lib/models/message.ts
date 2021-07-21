import { Member, User } from './models.ts';
import { MessageData } from '../types';
import Client from '../client.ts';

export class Message {
  client: Client;
  id: string;
  channelId: string;
  guildId?: string;
  author: User;
  member?: Member;
  content: string;

  constructor(client: Client, message: MessageData) {
    this.client = client;
    this.id = message.id;
    this.channelId = message.channel_id;
    this.guildId = message.guild_id;
    this.author = new User(client, message.author);
    this.member = message.guild_id && message.member ? new Member(client, message.guild_id, message.member) : undefined;
    this.content = message.content;
  }

}


export class ChannelMessages {}