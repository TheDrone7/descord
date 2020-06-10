import { Flags } from '../struct.ts';
import Client from '../client.ts';
import { Presence, Activity } from '../interfaces/interface.ts';

/**
 * The descord client's discord user representation.
 */
class ClientUser {
  readonly client: Client;
  readonly id: string;
  readonly username: string;
  readonly discriminator: string;
  readonly avatarHash: string | null;
  readonly bot: boolean;
  readonly flags: string[];
  readonly mfaEnabled: boolean | null;
  readonly verified: boolean | null;
  #presence: Presence | undefined;

  /**
   * Create a new discord client user.
   *
   * @param client The descord client that this user represents.
   * @param user The user's info.
   * @param presence The user's default presence.
   */
  constructor(client: Client, user: any, presence?: Presence) {
    this.client = client;
    this.id = user.id;
    this.username = user.username;
    this.discriminator = user.discriminator;
    this.avatarHash = user.avatar;
    this.bot = user.bot;
    this.mfaEnabled = user.mfa_enabled;
    this.verified = user.verified;
    this.flags = [];
    this.#presence = presence;

    Object.keys(Flags)
      .filter((x) => !isNaN(Number(x)))
      .map((x) => Number(x))
      .forEach((flag) => {
        if (user.flags && flag === flag) this.flags.push(Flags[flag]);
      });
  }

  /**
   * The discord user's tag.
   */
  get tag() {
    return this.username + '#' + this.discriminator;
  }

  /**
   * The timestamp of the time when this user's account was created.
   */
  get createdTimestamp() {
    return parseInt((BigInt('0b' + parseInt(this.id).toString(2)) >> 22n).toString()) + 1420070400000;
  }

  /**
   * The date-time object of the time when this user's account was created.
   */
  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  /**
   * The default discord user avatar for this user.
   */
  get defaultAvatarURL() {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(this.discriminator) % 5}.png`;
  }

  /**
   * Returns the user's current presence.
   */
  get presence() {
    return this.#presence;
  }

  avatarURL(size?: number) {
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}.${
      this.avatarHash?.startsWith('a_') ? 'gif' : 'png'
    }${size ? `?size=${size}` : ''}`;
  }

  /**
   * Updates the bot's presence.
   *
   * @param presence The new presence to be set for the bot
   */
  setPresence(presence: Presence) {
    let newPresence = {
      status: presence.status,
      since: presence.since || Date.now(),
      game: presence.game || undefined,
      afk: presence.afk || false
    };
    this.client.wsSend({
      op: 3,
      d: newPresence
    });
    this.#presence = newPresence;
  }

  /**
   * Updates the bot's current activity.
   *
   * @param activity The new activity for the bot.
   */
  setActivity(activity: Activity) {
    let newPresence = {
      status: this.#presence?.status || 'online',
      since: this.#presence?.since || Date.now(),
      game: activity,
      afk: this.#presence?.afk || false
    };
    this.client.wsSend({
      op: 3,
      d: newPresence
    });
    this.#presence = newPresence;
  }
}

export default ClientUser;
