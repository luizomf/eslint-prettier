const nodeReadLine = require('readline');

const readline = nodeReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (question, callback) => {
  return readline.question(question, (answer) => {
    return callback(answer, readline.close.bind(readline));
  });
};

module.exports = {
  ask,
};
