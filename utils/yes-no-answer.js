const isYes = (answer) => answer.toLocaleLowerCase().startsWith('s');
const isNo = (answer) => !isYes(answer);

module.exports = {
  isYes,
  isNo,
};
