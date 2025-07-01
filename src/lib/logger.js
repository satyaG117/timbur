const LogLevel = require('../utils/log-level');

class Logger {
    /** 
     * minimum level of log message that will be logged
     * anything below the defined level will be ignored
     */
    #level = 0;
    /**
     * prefix of the auto-generated log file
     */
    #filePrefix = '';
    /**
     * postfix of the auto-generated log file
     */
    #filePostfix = '';

    /**
     * specifies whether to automatically log uncaught errors or not
     */
    #logUncaughtErrors = false;

    // this method will do stuff like creating log file and some other initializing stuff.
    init() {

    }

    // config validation logic

    // check if a given level is valid
    static validateLevel(level) {
        return Number.isInteger(level) && level >= LogLevel.DEBUG && level <= LogLevel.FATAL;
    }

    // check if a given file prefix or suffix is valid
    static validateFileNamePart(part) {
        if (typeof part !== 'string') return false;

        if (part === '') return true;

        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
        const reserved = new Set([
            'CON', 'PRN', 'AUX', 'NUL',
            'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
            'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
        ]);

        const trimmed = part.trim();
        return (
            !invalidChars.test(trimmed) &&
            !reserved.has(trimmed.toUpperCase())
        );
    }


    // check if a given value is boolean
    static validateBoolean(value) {
        return typeof value === 'boolean';
    }

    #log(logLevel, message) {
        console.log(`${logLevel} | ${message}`);
    }

    debug(message) {
        this.#log("DEBUG", message);
    }

    info(message) {
        this.#log("INFO", message);
    }

    warn(message) {
        this.#log("WARN", message);
    }

    error(message) {
        this.#log("ERROR", message);
    }

    fatal(message) {
        this.#log("FATAL", message);
    }
}

module.exports = Logger;