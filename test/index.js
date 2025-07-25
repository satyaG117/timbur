const { Logger } = require('../src/index');

const logger = Logger.createLogger({
    filePrefix : "DEMO__",
    level : 1,
    rollingTimeLimit : 3,
    rollingFileSizeLimit : 1
})


function c(){
    logger.info("Hello World")
}

function b(){
    c()
}

function a(){
    b()
}

a()
// logger.info("Hello world");
// setTimeout(()=>{
//     logger.fatal("Hello world");    
// },2000)
// logger.warn("Hello world");
// logger.error("Hello world");

// for(let i = 0 ; i < 500; i++){
//     logger.info("Hello this is a test message :-)");
// }