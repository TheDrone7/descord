import { Activity, PresenceStatus, PresenceUpdate } from '../types/index.ts';
import Client from '../client.ts';
import { List } from '../util/util.ts';
import { User } from './models.ts';

export class UserPresence {
  client: Client;
  user: User;
  guildID: string;
  status: PresenceStatus;
  activities: Activity[];
  clientStatus: {
    desktop?: PresenceStatus;
    mobile?: PresenceStatus;
    web?: PresenceStatus;
  };

  constructor(client: Client, p: PresenceUpdate) {
    this.client = client;
    this.user = this.client.users.get(p.user.id) || new User(client, p.user);
    this.guildID = p.guild_id;
    this.status = p.status;
    this.activities = p.activities || [];
    this.clientStatus = p.client_status;
  }

  get guild() { return this.client.guilds.get(this.guildID) }
}

export class GuildPresences extends List<string, UserPresence> {
  client: Client;

  constructor(client: Client, ...presences: PresenceUpdate[]) {
    super(...presences.map(p => new UserPresence(client, p)));
    this.client = client;
  }
}