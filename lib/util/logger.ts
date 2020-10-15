import * as log from "https://deno.land/std@0.74.0/log/mod.ts";
import type { LogRecord } from "https://deno.land/std@0.74.0/log/logger.ts";

class CustomHandler extends log.handlers.BaseHandler {}

interface DescordLoggerOptions {
    logType: ('console'|'file'|'both'|'custom');
    logLevel: log.LevelName;
    fileOptions?: { name?: string,  mode?: ('overwrite'|'append')},
    custom?: {
        format: (record: LogRecord) => string,
        log: (msg: string) => any
    }
}

class DescordLogger {
    #logger?: log.Logger;

    async init(options: DescordLoggerOptions) {
        let handlers: any = {};
        if (options.logType === 'console' || options.logType === 'both') handlers.console = new log.handlers.ConsoleHandler(options.logLevel, {
            formatter: record => `[${record.datetime.toISOString()}] ${record.levelName.padEnd(8, ' ')} :: ${record.msg}`
        });
        if (options.logType === 'file' || options.logType === 'both') handlers.file = new log.handlers.FileHandler(options.logLevel, { 
            filename: options.fileOptions?.name || 'descord.log',
            formatter: record => `[${record.datetime.toISOString()}] ${record.levelName.padEnd(8, ' ')} :: ${record.msg}`,
            mode: options.fileOptions?.mode === 'append' ? 'a' : 'w'
        });
        if (options.logType === 'custom') {
            if (options.custom) {
                CustomHandler.prototype.format = options.custom.format;
                CustomHandler.prototype.log = options.custom.log;
                handlers.custom = new CustomHandler(options.logLevel);
            } else {
                handlers.custom = new log.handlers.ConsoleHandler(options.logLevel, {
                    formatter: record => `[${record.datetime.toISOString()}] ${record.levelName.padEnd(8, ' ')} :: ${record.msg}`
                });
            }
        }
        
        await log.setup({ handlers,
            loggers: {
                default: {
                    level: options.logLevel,
                    handlers: options.logType === 'both' ? ['file', 'console'] : [options.logType]
                }
            }
        });

        this.#logger = log.getLogger();
        
        if (options.logType === 'custom' && !options.custom) this.log('WARNING', 'Custom logger options not provided. Logging to console instead.');
    }

    log(level: log.LevelName, ...args: any[]) {
        let msg = args.map(x => (typeof x === 'object') ? JSON.stringify(x) : x.toString()).join(' ');
        let array = msg.split('\n');
        for (let message of array) {
            switch (level) {
                case 'CRITICAL':
                    this.#logger?.critical(message);
                    break;
                case 'ERROR':
                    this.#logger?.error(message);
                    break;
                case 'WARNING':
                    this.#logger?.warning(message);
                    break;
                case 'INFO':
                    this.#logger?.info(message);
                    break;
                case 'DEBUG':
                    this.#logger?.debug(message);
                    break;
                case 'NOTSET':
                    this.#logger?.info(message);
                    break;
            }
        }
    }
};

export default DescordLogger;
export type { DescordLoggerOptions };