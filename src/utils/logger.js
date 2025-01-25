/**
* Log levels enum
* @enum {string}
*/
export const LogLevel = {
DEBUG: 'debug',
INFO: 'info',
WARN: 'warn',
ERROR: 'error',
};

/**
* Format log message with metadata
* @param {string} level Log level
* @param {string} message Log message
* @param {Object} meta Additional metadata
* @returns {Object} Formatted log object
*/
const formatLog = (level, message, meta = {}) => ({
timestamp: new Date().toISOString(),
level,
message,
...meta,
});

/**
* Write log to console with proper formatting
* @param {string} level Log level
* @param {string} message Log message
* @param {Object} meta Additional metadata
*/
const writeLog = (level, message, meta = {}) => {
const logObject = formatLog(level, message, meta);

switch (level) {
    case LogLevel.ERROR:
    console.error(JSON.stringify(logObject));
    break;
    case LogLevel.WARN:
    console.warn(JSON.stringify(logObject));
    break;
    case LogLevel.INFO:
    console.info(JSON.stringify(logObject));
    break;
    default:
    console.log(JSON.stringify(logObject));
}
};

/**
* Logger instance with all log levels
*/
export const logger = {
debug: (message, meta) => writeLog(LogLevel.DEBUG, message, meta),
info: (message, meta) => writeLog(LogLevel.INFO, message, meta),
warn: (message, meta) => writeLog(LogLevel.WARN, message, meta),
error: (message, meta) => writeLog(LogLevel.ERROR, message, meta),
};

