const path = require('path')

module.exports.getAbsolutePath = (dirPath) =>{
    if(path.isAbsolute(dirPath)) return dirPath;

    return path.resolve(process.cwd() , dirPath);
}