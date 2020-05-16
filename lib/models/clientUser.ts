import { Flags } from '../struct.ts';
import Client from '../client.ts';
import { Presence } from '../interfaces/interface.ts';

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

  get client() {
    return this.#client;
  }

  get id() {
    return this.#id;
  }

  get username() {
    return this.#username;
  }

  get discriminator() {
    return this.#discriminator;
  }

  get avatarHash() {
    return this.#avatarHash;
  }

  get bot() {
    return this.#bot;
  }

  get flags() {
    return this.#flags;
  }

  get tag() {
    return this.#username + '#' + this.#discriminator;
  }

  get createdTimestamp() {
    return (
      parseInt(
        (BigInt('0b' + parseInt(this.#id).toString(2)) >> 22n).toString()
      ) + 1420070400000
    );
  }

  get createdAt() {
    return new Date(this.createdTimestamp);
  }

  get defaultAvatarURL() {
    return `https://cdn.discordapp.com/embed/avatars/${
      parseInt(this.#discriminator) % 5
    }.png`;
  }

  get mfaEnabled() {
    return this.#mfaEnabled;
  }

  get verified() {
    return this.#verified;
  }

  get presence() {
    return this.#presence;
  }
}

export default ClientUser;
