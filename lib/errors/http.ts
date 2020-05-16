class HTTPError extends Error {
  constructor(response: any) {
    super(
      `HTTPError while making request to '${response.url}'.\nReturned status: ${response.status} - ${response.statusText}`
    );
  }
}

export default HTTPError;
