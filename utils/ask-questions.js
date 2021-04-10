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

const askPromise = {
  question: (question) =>
    new Promise((resolve) => {
      readline.question(question, (answer) => {
        return resolve(answer);
      });
    }),
  close: readline.close.bind(readline),
  answers: {},
};

module.exports = {
  ask,
  askPromise,
};
