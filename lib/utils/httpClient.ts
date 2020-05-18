import Client from '../client.ts';
import {
  HTTPClientConfig,
  HTTPRequestOptions
} from '../interfaces/interface.ts';

class HTTPClient {
  baseUrl: string;
  apiVersion: number;
  client: any;

  constructor(client: Client, config: HTTPClientConfig) {
    this.client = client;
    this.baseUrl = config.baseUrl || 'https://discord.com/api/v';
    this.apiVersion = config.apiVersion || 6;
  }

  async get(path: string, config: HTTPRequestOptions) {
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': config.headers.contentType || 'application/json',
        Authorization:
          config.headers.authorization || `Bot ${this.client.token}`
      }
    });
    if (response.status.toString().startsWith('2') && response.status !== 204) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.json()
      };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.text()
      };
    }
  }

  async post(path: string, config: HTTPRequestOptions) {
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'POST',
      body: config.body || {},
      headers: {
        'Content-Type': config.headers.contentType || 'application/json',
        Authorization:
          config.headers.authorization || `Bot ${this.client.token}`
      }
    });
    if (response.status.toString().startsWith('2') && response.status !== 204) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.json()
      };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.text()
      };
    }
  }

  async patch(path: string, config: HTTPRequestOptions) {
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'PATCH',
      body: config.body || {},
      headers: {
        'Content-Type': config.headers.contentType || 'application/json',
        Authorization:
          config.headers.authorization || `Bot ${this.client.token}`
      }
    });
    if (response.status.toString().startsWith('2') && response.status !== 204) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.json()
      };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.text()
      };
    }
  }

  async put(path: string, config: HTTPRequestOptions) {
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'PUT',
      body: config.body || {},
      headers: {
        'Content-Type': config.headers.contentType || 'application/json',
        Authorization:
          config.headers.authorization || `Bot ${this.client.token}`
      }
    });
    if (response.status.toString().startsWith('2') && response.status !== 204) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.json()
      };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.text()
      };
    }
  }

  async delete(path: string, config: HTTPRequestOptions) {
    let response = await fetch(`${this.baseUrl}${this.apiVersion}/${path}`, {
      method: 'DELETE',
      body: config.body || {},
      headers: {
        'Content-Type': config.headers.contentType || 'application/json',
        Authorization:
          config.headers.authorization || `Bot ${this.client.token}`
      }
    });
    if (response.status.toString().startsWith('2') && response.status !== 204) {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.json()
      };
    } else {
      return {
        status: response.status,
        statusText: response.statusText,
        body: await response.text()
      };
    }
  }
}

export default HTTPClient;
