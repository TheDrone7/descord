import Client from '../client.ts';

export default class {
  #client: Client;
  #available: boolean;
  #id: string;

  #name?: string;
  #icon?: string;
  #splash?: string;
  owner: any;
  ownerId?: string;
  AFKChannel?: string;

  constructor(client: Client, data: any) {
    this.#client = client;
    this.#id = data.id;
    if (data.unavailable) this.#available = false;
    else this.#available = true;
  }

  get available() {
    return this.#available;
  }
  get id() {
    return this.#id;
  }

  get name() {
    return this.#name!;
  }
  get iconHash() {
    return this.#icon!;
  }
  get splashHash() {
    return this.#splash!;
  }
  get client() {
    return this.#client;
  }
}
