class HttpError extends Error {
    constructor(response: Response, ...args: any[]) {
        super(`HTTP Error while making a request to ${response.url}.\nReturned status: ${response.status} - ${response.statusText}.${(args && args.length > 0) ? '\n' + args.join('\n') : ''}`);
    }
}

export { HttpError };