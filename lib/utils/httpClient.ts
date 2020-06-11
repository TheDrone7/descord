import Client from '../client.ts';
import { HTTPClientConfig, HTTPRequestOptions } from '../interfaces/interface.ts';
import { HTTPError } from '../errors/error.ts';

/**
 * An HTTP Client for interaction with the discord API.
 */
class HTTPClient {
  baseUrl: string;
  apiVersion: number;
  client: any;

  /**
   * Creates a new HTTP Client.
   * @param client The descord client that this http client belongs to.
   * @param config The HTTP Client config.
   */
  constructor(client: Client, config: HTTPClientConfig) {
    this.client = client;
    this.baseUrl = config.baseUrl || 'https://discord.com/api/v';
    this.apiVersion = config.apiVersion || 6;
  }

  /**
   * Makes an HTTP GET request to the discord REST API.
   *
   * @param path The path to make the request to (does not include base URL)
   * @param config The HTTP Request options.
   */
  async get(path: string, config?: HTTPRequestOptions) {
    if (!config) config = { headers: new Headers() };
    else if (!config.headers) config.headers = new Headers();
    config?.headers?.append('Authorization', `Bot ${this.client.token}`);
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'GET',
      headers: config?.headers
    });
    if (response.status.toString().startsWith('2')) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: (await response.json()) || {}
      };
    } else {
      throw new HTTPError({
        url: `${this.baseUrl}${this.apiVersion}/${path}`,
        status: response.status,
        statusText: response.statusText
      });
    }
  }

  /**
   * Makes an HTTP POST request to the discord REST API.
   *
   * @param path The path to make the request to.
   * @param config The HTTP Request options.
   */
  async post(path: string, config?: HTTPRequestOptions) {
    if (!config) config = { headers: new Headers() };
    else if (!config.headers) config.headers = new Headers();
    config?.headers?.append('Authorization', `Bot ${this.client.token}`);
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'POST',
      body: config?.body,
      headers: config?.headers
    });
    if (response.status.toString().startsWith('2')) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: (await response.json()) || {}
      };
    } else {
      throw new HTTPError({
        url: `${this.baseUrl}${this.apiVersion}/${path}`,
        status: response.status,
        statusText: response.statusText
      });
    }
  }

  /**
   * Makes an HTTP PATCH request to the discord REST API.
   *
   * @param path The path to make the request to.
   * @param config The HTTP Request options.
   */
  async patch(path: string, config?: HTTPRequestOptions) {
    if (!config) config = { headers: new Headers() };
    else if (!config.headers) config.headers = new Headers();
    config?.headers?.append('Authorization', `Bot ${this.client.token}`);
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'PATCH',
      body: config?.body,
      headers: config?.headers
    });
    if (response.status.toString().startsWith('2') && response.status !== 204) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: (await response.json()) || {}
      };
    } else {
      throw new HTTPError({
        url: `${this.baseUrl}${this.apiVersion}/${path}`,
        status: response.status,
        statusText: response.statusText
      });
    }
  }

  /**
   * Makes an HTTP PUT request to the discord REST API.
   *
   * @param path The path to make the request to.
   * @param config The HTTP Request options.
   */
  async put(path: string, config?: HTTPRequestOptions) {
    if (!config) config = { headers: new Headers() };
    else if (!config.headers) config.headers = new Headers();
    config?.headers?.append('Authorization', `Bot ${this.client.token}`);
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'PUT',
      body: config?.body,
      headers: config?.headers
    });
    if (response.status.toString().startsWith('2')) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: (await response.json()) || {}
      };
    } else {
      throw new HTTPError({
        url: `${this.baseUrl}${this.apiVersion}/${path}`,
        status: response.status,
        statusText: response.statusText
      });
    }
  }

  /**
   * Makes an HTTP DELETE request to the discord REST API.
   *
   * @param path The path to make the request to.
   * @param config The HTTP Request options.
   */
  async delete(path: string, config?: HTTPRequestOptions) {
    if (!config) config = { headers: new Headers() };
    else if (!config.headers) config.headers = new Headers();
    config?.headers?.append('Authorization', `Bot ${this.client.token}`);
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'DELETE',
      body: config?.body,
      headers: config?.headers
    });
    if (response.status.toString().startsWith('2') && response.status !== 204) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: (await response.json()) || {}
      };
    } else {
      throw new HTTPError({
        url: `${this.baseUrl}${this.apiVersion}/${path}`,
        status: response.status,
        statusText: response.statusText
      });
    }
  }
}

export default HTTPClient;
