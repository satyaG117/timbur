const Logger = require('./logger')

class LoggerManager {
    static createLogger(config) {
        const logger = new Logger(config);
        logger.init();

        // Listen for SIGINT (Ctrl+C)
        process.on('SIGINT', logger.gracefulShutdown.bind(logger));

        // Listen for SIGTERM (sent by process managers)
        process.on('SIGTERM', logger.gracefulShutdown.bind(logger));

        // Listen for the 'exit' event (when the process is about to terminate)
        process.on('beforeExit', logger.gracefulShutdown.bind(logger));

        return logger;
    }
}

module.exports = LoggerManager;

