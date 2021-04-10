const fileSystem = require('fs');
const toJson = require('./to-json');

const saveFile = (filePath, obj) => {
  return fileSystem.writeFileSync(filePath, toJson(obj));
};

module.exports = {
  saveFile,
};
