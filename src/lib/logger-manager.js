const Logger = require('./logger')

class LoggerManager {
    static createLogger(config) {
        const logger = new Logger(config);
        logger.init();

        return logger;
    }
}

module.exports = LoggerManager;

