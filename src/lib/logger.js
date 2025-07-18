const fs = require('node:fs/promises');
const fss = require('node:fs');
const path = require('node:path')
const { once } = require('node:events')

const LogLevel = require('../utils/log-level');
const { getAbsolutePath } = require('../utils/helpers')
const LoggerError = require('../utils/logger-error')

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

    /**
     * this is where log files are saved
     */
    #saveDirectoryPath = 'logs'

    /**
     * the file handle of the current log file
     */
    #logFileStream = null


    constructor(config) {

        if (!config) return;

        if ('level' in config) {
            if (this.constructor.validateLevel(config.level)) {
                this.#level = config.level;
            } else {
                throw new LoggerError("Log level should be an integer >= 0 and <= 4");
            }
        }

        if ('filePrefix' in config) {
            if (this.constructor.validateFileNamePart(config.filePrefix)) {
                this.#filePrefix = config.filePrefix;
            } else {
                throw new LoggerError("File prefix shouldnot contain any invalid characters or reserved keywords");
            }
        }

        if ('filePostfix' in config) {
            if (this.constructor.validateFileNamePart(config.filePostfix)) {
                this.#filePostfix = config.filePostfix;
            } else {
                throw new LoggerError("File postfix shouldnot contain any invalid characters or reserved keywords");
            }
        }

        if ('logUncaughtErrors' in config) {
            if (this.constructor.validateBoolean(config.logUncaughtErrors)) {
                this.#logUncaughtErrors = config.logUncaughtErrors;
            } else {
                throw new LoggerError("logUncaughtErrors option should be a boolean value");
            }
        }

        if ('saveDirectoryPath' in config) {
            if (this.constructor.validateDirectoryPath(config.saveDirectoryPath)) {
                // get the absolute path
                this.#saveDirectoryPath = getAbsolutePath(config.saveDirectoryPath);

            } else {
                throw new LoggerError("Save directory path is not valid");
            }
        }

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

    // check if the user supplied path string doesn't have any invalid characters
    // NOTE : It doesn't check if the dir path actually is a legal path or not
    static validateDirectoryPath(path) {
        if (typeof path !== 'string' || path.trim() === '') return false;

        const invalidChars = /[<>:"|?*\x00-\x1F]/;

        return !invalidChars.test(path);
    }

    /**
     * this method will do stuff like creating log directory and some other initializing stuff 
     * */
    init() {
        fss.mkdirSync(this.#saveDirectoryPath, { recursive: true });

        const fileName = `${this.#filePrefix}${Date.now()}${this.#filePostfix}.log`;
        const fullPath = path.join(this.#saveDirectoryPath, fileName);
        this.#logFileStream = fss.createWriteStream(fullPath);

    }



    async #log(logLevel, message) {
        // console.log(`${logLevel} | ${message}`);
        this.#logFileStream.write(`${logLevel} | ${message}\n`)

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