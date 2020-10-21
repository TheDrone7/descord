import type { LevelName } from "https://deno.land/std@0.74.0/log/mod.ts";
import { DescordLogger, List, parseNum } from './util/util.ts';
import type { DescordLoggerOptions } from './util/util.ts';
import type { ClientPresence, Gateway, GatewayPayload } from './types/types.ts';
import { HttpError } from "./errors/errors.ts";
import { Shard, ShardManager } from "./models/models.ts";

interface ClientOptions {
    logging?: (DescordLoggerOptions|false)
}

export default class Client {
    #httpBase: string;
    #wsBase: string;
    #cdnBase: string;
    #token?: string;

    #shardCount: number;
    #shardManger: ShardManager;

    #eventManager: List<string, (...params: any[]) => void>;

    #loggerOptions: (DescordLoggerOptions|false);
    #logger?: DescordLogger;

    constructor(options?: ClientOptions) {
        this.#loggerOptions = options?.logging === undefined ? {
            logType: 'console',
            logLevel: 'INFO'
        } : options.logging;

        this.#httpBase = 'https://discord.com/api/v8';
        this.#wsBase = 'wss://gateway.discord.gg/?v=8&encoding=json';
        this.#cdnBase = 'https://cdn.discordapp.com/';

        this.#eventManager = new List();

        this.#shardCount = 1;
        this.#shardManger = new ShardManager(this);
    }

    get token() { return this.#token!; }
    get cdnBase() { return this.#cdnBase; }

    log(level: LevelName, ...args: any[]) {
        if (this.#logger instanceof DescordLogger) this.#logger.log(level, ...args);
    }

    logError(level: ('CRITICAL'|'ERROR'), error: Error) {
        if (error.stack) this.log(level, error.stack.substr(7));
        else this.log(level, error.message);
    }

    raw(rawListener: (d: GatewayPayload) => void) { this.#eventManager.set('raw', rawListener); }
    
    execute(event: string, ...params: any[]) { if (this.#eventManager.has(event)) this.#eventManager.get(event)(...params); }

    wsSend(data: any) {
        for (const shard of this.#shardManger.array())
            shard.ws.send(typeof data === 'string' ? data : JSON.stringify(data));
    }

    async start(token: string, options?: { presence?: ClientPresence }) {
        if (this.#loggerOptions !== false) {
            this.#logger = new DescordLogger();
            await this.#logger.init(this.#loggerOptions);
        }

        let gatewayResponse = await fetch(`${this.#httpBase}/gateway/bot`, {
            method: 'GET',
            headers: { Authorization: `Bot ${token}` }
        });

        if (gatewayResponse.status !== 200) {
            this.logError('CRITICAL', new HttpError(gatewayResponse, 'Invalid Discord Bot Token Provided.'));
            Deno.exit(1);
        }

        this.log('DEBUG', 'Gateway data successfully fetched.');
        let gateway = await gatewayResponse.json() as Gateway;

        if (gateway.session_start_limit.remaining < 1) {
            this.logError('CRITICAL', new Error(`You've hit your limit for ${gateway.session_start_limit.total} sessions. The limit will reset after ${parseNum(gateway.session_start_limit.reset_after)}.`));
            Deno.exit(1);
        }

        this.#token = token;

        this.log('DEBUG', `Trying to log in using the provided token. Creating ${this.#shardCount} shards.`);

        let shardId = 0;
        while (shardId < this.#shardCount) {
            this.#shardManger.initialize(this.#wsBase, shardId, this.#shardCount, options);
            shardId++;
        }
    }
};