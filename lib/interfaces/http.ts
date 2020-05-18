interface HTTPClientConfig {
  baseUrl?: string;
  apiVersion?: number;
}

interface HTTPRequestHeaders {
  authorization?: string;
  contentType: string;
  cookie?: string;
  setCookie?: string;
}

interface HTTPRequestOptions {
  headers: HTTPRequestHeaders;
  body: any;
}

export { HTTPClientConfig, HTTPRequestHeaders, HTTPRequestOptions };
