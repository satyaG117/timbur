const fs = require('node:fs/promises');
const fss = require('node:fs');
const path = require('node:path')
const { once } = require('node:events')

const LogLevel = require('../utils/log-level');
const { getAbsolutePath, getLogOrigin, getFileNameFriendlyISODateString } = require('../utils/helpers')
const LoggerError = require('../utils/logger-error')
const LoggerConfig = require('../config/logger-config');

class Logger {
    #config = new LoggerConfig

    #logFileStream = null
    #currentLogFileName = ''
    #currentFileCreationTime;
    #currentFileSize;

    #isRotating = false;
    #isInternalBufferFull = false;
    #isExternalBufferFlushing = false;
    #externalBuffer = []

    constructor(config) {

        if (!config) return;

        if ('level' in config) {
            if (LoggerConfig.isValidLevel(config.level)) {
                this.#config.level = config.level;
            } else {
                throw new LoggerError("Log level should be an integer >= 0 and <= 4");
            }
        }

        if ('filePrefix' in config) {
            if (LoggerConfig.isValidFileNamePart(config.filePrefix)) {
                this.#config.filePrefix = config.filePrefix;
            } else {
                throw new LoggerError("File prefix shouldnot contain any invalid characters or reserved keywords");
            }
        }

        if ('filePostfix' in config) {
            if (LoggerConfig.isValidFileNamePart(config.filePostfix)) {
                this.#config.filePostfix = config.filePostfix;
            } else {
                throw new LoggerError("File postfix shouldnot contain any invalid characters or reserved keywords");
            }
        }

        if ('logUncaughtErrors' in config) {
            if (LoggerConfig.isBoolean(config.logUncaughtErrors)) {
                this.#config.logUncaughtErrors = config.logUncaughtErrors;
            } else {
                throw new LoggerError("logUncaughtErrors option should be a boolean value");
            }
        }

        if ('saveDirectoryPath' in config) {
            if (LoggerConfig.isValidDirectoryPath(config.saveDirectoryPath)) {
                // get the absolute path
                this.#config.saveDirectoryPath = getAbsolutePath(config.saveDirectoryPath);

            } else {
                throw new LoggerError("Save directory path is not valid");
            }
        }

        if ('rollingTimeLimit' in config) {
            if (LoggerConfig.isPositiveNumber(config.rollingTimeLimit)) {
                this.#config.rollingTimeLimit = config.rollingTimeLimit;
            } else {
                throw new LoggerError("Rolling Time(in sec) must be a non negative number");
            }
        }

        if ('rollingFileSizeLimit' in config) {
            if (LoggerConfig.isPositiveNumber(config.rollingFileSizeLimit)) {
                this.#config.rollingFileSizeLimit = config.rollingFileSizeLimit;
            } else {
                throw new LoggerError("Rolling File Size(in kbs) must be a non negative number");
            }
        }



    }


    /**
     * this method will do stuff like creating log directory and some other initializing stuff 
     * */
    init() {
        fss.mkdirSync(this.#config.saveDirectoryPath, { recursive: true });

        this.#currentLogFileName = `${this.#config.filePrefix}${getFileNameFriendlyISODateString()}${this.#config.filePostfix}.log`;
        const fullPath = path.join(this.#config.saveDirectoryPath, this.#currentLogFileName);

        this.#logFileStream = fss.createWriteStream(fullPath);

        // the creation time isn't 100% accurate but this method allows us to reduce latency by decent margin
        this.#currentFileSize = 0;
        this.#currentFileCreationTime = Date.now();

    }

    async #flushExternalBuffer() {
        this.#isExternalBufferFlushing = true;

        while (this.#externalBuffer.length > 0) {
            // if the file has exceeded the limits then just wait and don't write
            if (this.#hasExceededRollingThresholds()) {
                await this.#rotateFile();
            }

            let logMessage = this.#externalBuffer.shift();
            const ok = this.#writeToFile(logMessage)
            if (!ok) {
                this.#isInternalBufferFull = true;
                await once(this.#logFileStream, 'drain');
                this.#isInternalBufferFull = false;
            }

        }

        this.#isExternalBufferFlushing = false;
    }


    async #writeToFile(logMessage) {
        let ok = this.#logFileStream.write(logMessage);
        this.#currentFileSize += Buffer.byteLength(logMessage);

        return ok;
    }


    #hasExceededRollingThresholds() {
        return (
            (this.#config.rollingTimeLimit &&
                ((Date.now() - this.#currentFileCreationTime) / 1000 >= this.#config.rollingTimeLimit)) ||
            (this.#config.rollingFileSizeLimit &&
                (this.#currentFileSize / 1000 >= this.#config.rollingFileSizeLimit))
        );
    }





    async #log(logLevel, message) {
        // if the log level of message is below what is defined then ignore
        if (LogLevel.toInteger(logLevel) < this.#config.level) return;

        const logOrigin = getLogOrigin();
        //prepare the log message
        let logMessage = `[${new Date().toISOString()}]\t[${logLevel}]\t[${logOrigin}]: \t${message}\n`

        // if logfile is being rotated or if the internal buffer is full then write to external buffer
        if (this.#isRotating || this.#isInternalBufferFull || this.#isExternalBufferFlushing) {
            this.#externalBuffer.push(logMessage);
            return;
        }

        // if the file has exceeded the time or size threshold then we need to roll
        if (this.#hasExceededRollingThresholds()) {
            this.#externalBuffer.push(logMessage); // since we are rotating files we need to write this message to external buffer
            await this.#rotateFile();
            // after rotating files we need to flush the logs that were in the buffer
            await this.#flushExternalBuffer();
        } else {
            // write to the stream and increase file size
            const ok = this.#writeToFile(logMessage);


            if (!ok) {
                this.#isInternalBufferFull = true;
                await once(this.#logFileStream, 'drain');
                this.#isInternalBufferFull = false;
                await this.#flushExternalBuffer();
            }
        }

    }

    async #rotateFile() {
        this.#isRotating = true;

        this.#logFileStream.end();
        await once(this.#logFileStream, 'finish');

        this.#currentLogFileName = `${this.#config.filePrefix}${getFileNameFriendlyISODateString()}${this.#config.filePostfix}.log`;
        const fullPath = path.join(this.#config.saveDirectoryPath, this.#currentLogFileName);
        this.#logFileStream = fss.createWriteStream(fullPath)
        this.#currentFileCreationTime = Date.now();
        this.#currentFileSize = 0;

        this.#isRotating = false;

        // await this.#flushExternalBuffer();
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