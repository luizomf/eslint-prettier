const endColor = '\u001b[0m';
const bgGreen = (...args) => `\u001b[30m\u001b[42m${args.join(' ')}${endColor}`;
const white = (...args) => `\u001b[37m${args.join(' ')}${endColor}`;
const cyan = (...args) => `\u001b[36m${args.join(' ')}${endColor}`;
const magenta = (...args) => `\u001b[35m${args.join(' ')}${endColor}`;
const yellow = (...args) => `\u001b[33m${args.join(' ')}${endColor}`;
const green = (...args) => `\u001b[32m${args.join(' ')}${endColor}`;
const red = (...args) => `\u001b[31m${args.join(' ')}${endColor}`;
const blue = (...args) => `\u001b[34m${args.join(' ')}${endColor}`;
const black = (...args) => `\u001b[30m${args.join(' ')}${endColor}`;

module.exports = {
  endColor,
  bgGreen,
  white,
  cyan,
  magenta,
  yellow,
  green,
  red,
  blue,
  black,
};
