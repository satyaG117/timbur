const Logger = require('./logger')
const LoggerError = require('../utils/logger-error')
// const {getAbsolutePath} = require('../utils/helpers')

class LoggerManager {
    static createLogger(config) {
        const logger = new Logger(config);
        logger.init();

        return logger;
    }
}

module.exports = LoggerManager;

