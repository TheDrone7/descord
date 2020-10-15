import Client from '../client.ts';
import { GatewayPayload } from '../types/types.ts';

export default class Shard {
    #ws: WebSocket;
    client: Client;

    constructor(client: Client, url: string, shard: [number, number]) {
        this.client = client;
        this.#ws = new WebSocket(url);

        this.#ws.onopen = async function (event: Event) {
            client.log('DEBUG', `Connected shard ${shard[0] + 1} of ${shard[1]}.`);
        }

        this.#ws.onclose = async function (event: CloseEvent) {
            if (event.code === 1000) client.log('DEBUG', `Shard ${shard[0] + 1} of ${shard[1]} safely disconnected.`);
            else client.logError('ERROR', new Error(`Shard ${shard[0] + 1} of ${shard[1]} disconnected with code ${event.code} due to reason ${event.reason}.`));
        }

        this.#ws.onerror = (error: Event) => {
            client.logError('ERROR', new Error(error.toString()));
        }

        this.#ws.onmessage = async (event: MessageEvent) => {
            await this.handleEvent(event.data as GatewayPayload);
        }
    }

    handleEvent(raw: GatewayPayload) {
        this.client.log('DEBUG', raw);
    }
}