import * as log from "https://deno.land/std@0.74.0/log/mod.ts";

interface DescordLoggerOptions {
    logType: ('console'|'file'|'both');
    logLevel: log.LevelName;
    fileOptions?: { name?: string,  mode?: ('overwrite'|'append')}
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
            mode: options.fileOptions?.mode === 'overwrite' ? 'w' : 'a'
        });
        
        await log.setup({ handlers,
            loggers: {
                default: {
                    level: options.logLevel,
                    handlers: options.logType === 'both' ? ['file', 'console'] : [options.logType]
                }
            }
        });

        this.#logger = log.getLogger();
    }

    log(level: log.LevelName, ...args: any[]) {
        let msg = args.map(x => x.toString()).join(' ');
        switch (level) {
            case 'CRITICAL':
                this.#logger?.critical(msg);
                break;
            case 'ERROR':
                this.#logger?.error(msg);
                break;
            case 'WARNING':
                this.#logger?.warning(msg);
                break;
            case 'INFO':
                this.#logger?.info(msg);
                break;
            case 'DEBUG':
                this.#logger?.debug(msg);
                break;
            case 'NOTSET':
                this.#logger?.info(msg);
                break;
        }
    }
};

export default DescordLogger;
export type { DescordLoggerOptions };