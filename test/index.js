const { Logger } = require('../src/index');

const logger = Logger.createLogger({
    filePrefix : "DEMO__",
    level : 2
})


logger.debug("Hello world");
logger.info("Hello world");
logger.warn("Hello world");
logger.error("Hello world");