const path = require('path')

module.exports.getAbsolutePath = (dirPath) => {
    if (path.isAbsolute(dirPath)) return dirPath;

    return path.resolve(process.cwd(), dirPath);
}

module.exports.getLogOrigin = () => {
    let origin = ''
    try {
        throw new Error();
    } catch (err) {
        origin = err.stack.split('\n')[4].trim();
    }

    return origin;
}

module.exports.getFileNameFriendlyISODateString = () => {
    return new Date().toISOString().replace(/[:.]/g, '-');
}