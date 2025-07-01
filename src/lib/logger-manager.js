const Logger = require('./logger')
const LoggerError = require('../utils/logger-error')

class LoggerManager {
    static createLogger(config) {
        const logger = new Logger();

        if (config != null && 'level' in config) {
            if (Logger.validateLevel(config.level)) {
                logger.level = config.level;
            } else {
                throw new LoggerError("Log level should be an integer >= 0 and <= 4");
            }
        }

        if (config != null && 'filePrefix' in config) {
            if (Logger.validateFileNamePart(config.filePrefix)) {
                logger.filePrefix = config.filePrefix;
            } else {
                throw new LoggerError("File prefix shouldnot contain any invalid characters or reserved keywords");
            }
        }

        if (config != null && 'filePostfix' in config) {
            if (Logger.validateFileNamePart(config.filePostfix)) {
                logger.filePostfix = config.filePostfix;
            } else {
                throw new LoggerError("File postfix shouldnot contain any invalid characters or reserved keywords");
            }
        }

        if (config != null && 'logUncaughtErrors' in config) {
            if (Logger.validateBoolean(config.logUncaughtErrors)) {
                logger.logUncaughtErrors = config.logUncaughtErrors;
            } else {
                throw new LoggerError("logUncaughtErrors option should be a boolean value");
            }
        }

        

        return logger;
    }
}

module.exports = LoggerManager;

