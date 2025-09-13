const fs = require("fs")
const path = require("path")

module.exports = {}

module.exports.readDirRecursive = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            /* Recurse into a subdirectory */
            results = results.concat(module.exports.readDirRecursive(file));
        } else { 
            /* Is a file */
            results.push(file);
        }
    });
    return results;
}

module.exports.getLeftWordIndex = (text, index) => {
    if(index == 0)
        return 0;
    var words = text.split(" ");
    var wordGlobalIndex = 0;
    for(var i = 0; i < words.length; i++) {
        if(wordGlobalIndex >= index) {
            return wordGlobalIndex - words[i-1].length - 1;
        }
        wordGlobalIndex += words[i].length + 1;
    }
    return wordGlobalIndex - words[words.length-1].length - 1;
}

module.exports.getRightWordIndex = (text, index) => {
    var words = text.split(" ");
    var wordGlobalIndex = 0;
    for(var i = 0; i < words.length; i++) {
        if(wordGlobalIndex >= index) {
            return wordGlobalIndex + words[i].length;
        }
        wordGlobalIndex += words[i].length + 1;
    }
    return wordGlobalIndex;
}

module.exports.delay = time => new Promise(res=>setTimeout(res,time))

module.exports.arraysIsEqual = (arr1, arr2) => JSON.stringify(arr1) == JSON.stringify(arr2);

module.exports.insert = function(str, index, string) {
  if (index > 0)
  {
    return str.substring(0, index) + string + str.substring(index, str.length);
  }
  return string + str;
}

module.exports.removeByIndex = function(str, index) {
    return str.slice(0,index) + str.slice(index+1);
}