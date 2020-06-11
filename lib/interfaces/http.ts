interface HTTPClientConfig {
  baseUrl?: string;
  apiVersion?: number;
}

interface HTTPRequestOptions {
  headers?: Headers;
  body?: any;
}

export { HTTPClientConfig, HTTPRequestOptions };
