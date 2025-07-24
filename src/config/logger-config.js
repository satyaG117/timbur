const LogLevel = require('../utils/log-level');

class LoggerConfig {
    /** 
 * minimum level of log message that will be logged
 * anything below the defined level will be ignored
 */
    level = 0;
    /**
     * prefix of the auto-generated log file
     */
    filePrefix = '';
    /**
     * postfix of the auto-generated log file
     */
    filePostfix = '';

    /**
     * specifies whether to automatically log uncaught errors or not
     */
    logUncaughtErrors = false;

    /**
     * this is where log files are saved
     */
    saveDirectoryPath = 'logs'

    /**
     * rolling time and file size threshold
     * close current file and create new one to write to when the given time has elapsed or file size has exceeded
     */


    rollingTimeLimit; // in seconds
    rollingFileSizeLimit; // in kb

    // config validation logic

    // check if a given level is valid
    static isValidLevel(level) {
        return Number.isInteger(level) && level >= LogLevel.DEBUG && level <= LogLevel.FATAL;
    }

    // check if a given file prefix or suffix is valid
    static isValidFileNamePart(part) {
        if (typeof part !== 'string') return false;

        if (part === '') return true;

        const invalidChars = /[<>:"/\\|?*\x00-\x1F]/;
        const reserved = new Set([
            'CON', 'PRN', 'AUX', 'NUL',
            'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
            'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
        ]);

        const trimmed = part.trim();
        return (
            !invalidChars.test(trimmed) &&
            !reserved.has(trimmed.toUpperCase())
        );
    }


    // check if a given value is boolean
    static isBoolean(value) {
        return typeof value === 'boolean';
    }

    // check if the user supplied path string doesn't have any invalid characters
    // NOTE : It doesn't check if the dir path actually is a legal path or not
    static isValidDirectoryPath(path) {
        if (typeof path !== 'string' || path.trim() === '') return false;

        const invalidChars = /[<>:"|?*\x00-\x1F]/;

        return !invalidChars.test(path);
    }

    static isPositiveNumber(value){
        return typeof value === 'number' && value > 0;
    }

}

module.exports = LoggerConfig;