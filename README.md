### ⚠️ This is a fun little project I made to get back into coding again after a while. DO NOT USE IT IN ANYTHING SERIOUS. You can play around it if you want. Thank you.

# timbur

Timbur ( wordplay on timber, because its a "log"ging tool..get it ? no ? okay ) is a logging utility for nodejs

## Features:

- Asynchronous Logging with write streams
- Automatic file rotation based on file size or time threshold.
- Automatically detect origin of the log message
- External buffer to ensure logs aren't lost while rotating files or during situation of backpressure from streams.
- Log uncaught errors automatically before app crashes due to the same.
- Graceful shutdown in case of process termination ensuring logs are not lost

## Usage

Import the Logger class from the package and get the logger object

```javascript
const { Logger } = require("timbur");
const logger = Logger.createLogger({
  //options
});
```

Options are configurations that you pass to the logger during its creation. Here's an example

```javascript
const logger = Logger.createLogger({
  filePrefix: "DEMO_APP__",
  saveDirectoryPath: "logs/app-logs/",
});
```

The above example has two options:

```filePrefix``` which tells the logger what the log file should be prefixed with

```saveDirectioryPath``` is the directory location where the log files will be stored.

## Options

Here is the complete list of options

| Option   | Type |Description  | Default Value  | Note  |
|---|---|---|---|---|
| ``` level ```   | Integer  | Minimum log level; any log below this level will be ignored  | 0 | ALL VALUES <br/> 0 : DEBUG <br/> 1 : INFO <br/> 2 : WARN <br/> 3 : ERROR <br/> 4 : CRITICAL  |
| ``` filePrefix ```   | String | File prefix for the log files which will be created  | ""  |    |
| ``` filePostfix ```   | String | File prefix for the log files which will be created  | "" |   |
| ``` logUncaughtExceptions ```   |  Boolean | Decides whether to log uncaught exceptions before the program stops due to the same  | false |   |
| ``` saveDirectoryPath ```   |  String | Path where the log files will be created; can be both an absolute path or a relative path (relative to the root of the project) | logs/ | If using relative path do not start the path with a / For example : logs/app-logs is valid while /logs/app-logs will be treated as an absolute path  |
| ``` rollingTimeLimit ```   | Integer | Time in seconds which taken from the creation of the current log file, which when passed will trigger a log file rotation  | null(no rotation)  |    |
| ``` rollingFileSizeLimit ```   | Integer | Max size of the contents of the log file which when exceeded will trigger a log file rotation   | null(no rotation)  | Do note that here the size refers to the size of content on the file and not the size on disk |


## Logger singleton

Often when working with loggers you might want to share the same logger instance throughout multiple modules in your application. By default timbur doesn't have a singleton implementation out of the box but the same can be implemented by the user. Here is an example

``` javascript
// logger.js
const { Logger } = require('../src')

const logger = Logger.createLogger({
    filePrefix: 'DEMO_APP__',
    saveDirectoryPath: 'logs/app-logs/',
    logUncaughtExceptions : true,
    level : 1
})

module.exports = logger;
```
Here we have created a file named logger.js, this file can be imported by other modules which want to use logging. All the modules importing this particular file will have access to singular logger instance.

```javascript
// index.js
const logger = require('./logger.js')
const {add, sub, multiply, divide} = require('./calc.js')


function main(){
    logger.warn("You are in main module");
    add(3, 5);
    sub(3, 5);
    multiply(21, 3);
    divide(-3, 4);
}

main()
```
Here index.js file uses the logger instance

```javascript
//calc.js
const logger = require('./logger')

module.exports.add = (a, b) => {
    logger.info(a + b);
}

module.exports.sub = (a, b) => {
    logger.info(a - b);
}

module.exports.multiply = (a, b) => {
    logger.info(a * b);
}

module.exports.divide = async (a, b) => {
    logger.info(a / b);
}

```

The module calc.js has access to the same logger instance.

Hence we have achieved singleton logger functionality.