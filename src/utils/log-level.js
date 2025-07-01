class LogLevel{
    static #DEBUG = 0;
    static #INFO = 1;
    static #WARN = 2;
    static #ERROR = 3;
    static #FATAL = 4;

    static get DEBUG(){
        return this.#DEBUG;
    }

    static get INFO(){
        return this.#INFO;
    }

    static get WARN(){
        return this.#WARN;
    }

    static get ERROR(){
        return this.#ERROR;
    }

    static get FATAL(){
        return this.#FATAL;
    }
}

module.exports = LogLevel;