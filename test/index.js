const {Logger} = require('../src/index');

const logger = Logger.createLogger({
    level : 2,
    // filePrefix : "Demo__",
    filePostfix  : "__hi",
    logUncaughtErrors : "true"
})

logger.debug("Hello world");
logger.info("Hello world");
logger.warn("Hello world");
logger.error("Hello world");