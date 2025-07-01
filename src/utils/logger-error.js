class LoggerError extends Error{
    constructor(message){
        super(message);
    }
}

module.exports = LoggerError;