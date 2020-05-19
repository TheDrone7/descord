import { Flags } from '../struct.ts';
import Client from '../client.ts';
import { Presence } from '../interfaces/interface.ts';

/**
 * The descord client's discord user representation.
 */
class ClientUser {
  #client: Client;
  #id: string;
  #username: string;
  #discriminator: string;
  #avatarHash: string | null;
  #bot: boolean;
  #flags: string[];
  #mfaEnabled: boolean | null;
  #verified: boolean | null;
  #presence: Presence | undefined;

  /**
   * Create a new discord client user.
   * 
   * @param client The descord client that this user represents.
   * @param user The user's info.
   */
  constructor(client: Client, user: any) {
    this.#client = client;
    this.#id = user.id;
    this.#username = user.username;
    this.#discriminator = user.discriminator;
    this.#avatarHash = user.avatar;
    this.#bot = user.bot;
    this.#mfaEnabled = user.mfa_enabled;
    this.#verified = user.verified;
    this.#flags = [];

    Object.keys(Flags)
      .filter((x) => !isNaN(Number(x)))
      .map((x) => Number(x))
      .forEach((flag) => {
        if (user.flags && flag === flag) this.#flags.push(Flags[flag]);
      });
  }

  /**
   * The client that this discord user represents.
   */
  get client() {
    return this.#client;
  }

  /**
   * The discord user's ID.
   */
  get id() {
    return this.#id;
  }

  /**
   * The discord user's username.
   */
  get username() {
    return this.#username;
  }

  /**
   * The discord user's discriminator.
   */
  get discriminator() {
    return this.#discriminator;
  }

  /**
   * The discord user's avatar's ID.
   */
  get avatarHash() {
    return this.#avatarHash;
  }

  /**
   * Whether the discord user is a bot or not.
   */
  get bot() {
    return this.#bot;
  }

  /**
   * The discord user's FLAGS.
   */
  get flags() {
    return this.#flags;
  }

  /**
   * The discord user's tag.
   */
  get tag() {
    return this.#username + '#' + this.#discriminator;
  }

  /**
   * The timestamp of the time when this user's account was created.
   */
  get createdTimestamp() {
    return (
      parseInt(
        (BigInt('0b' + parseInt(this.#id).toString(2)) >> 22n).toString()
      ) + 1420070400000
    );
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
    return `https://cdn.discordapp.com/embed/avatars/${
      parseInt(this.#discriminator) % 5
    }.png`;
  }

  /**
   * Whether this user has 2FA enabled or not.
   */
  get mfaEnabled() {
    return this.#mfaEnabled;
  }

  /**
   * Whether this account has a verified e-mail ID or not.
   */
  get verified() {
    return this.#verified;
  }

  /**
   * Returns the user's current presence.
   */
  get presence() {
    return this.#presence;
  }
}

export default ClientUser;
