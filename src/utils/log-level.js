const LoggerError = require("./logger-error");

class LogLevel {
    static #DEBUG = 0;
    static #INFO = 1;
    static #WARN = 2;
    static #ERROR = 3;
    static #FATAL = 4;

    static get DEBUG() {
        return this.#DEBUG;
    }

    static get INFO() {
        return this.#INFO;
    }

    static get WARN() {
        return this.#WARN;
    }

    static get ERROR() {
        return this.#ERROR;
    }

    static get FATAL() {
        return this.#FATAL;
    }

    static toInteger(level) {
        level = level.toUpperCase();
        switch (level) {
            case "DEBUG": return 0;
            case "INFO": return 1;
            case "WARN": return 2;
            case "ERROR": return 3;
            case "FATAL": return 4;
            default: throw new LoggerError("Invalid level")
        }
    }

    static toString(level) {
        switch (level) {
            case 0 : return "DEBUG";
            case 1: return "INFO";
            case 2: return "WARN";
            case 3: return "ERROR";
            case 4: return "FATAL";
            default: throw new LoggerError("Invalid level")
        }
    }
}

module.exports = LogLevel;