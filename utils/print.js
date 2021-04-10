const colors = require('./color-functions');
const print = (color, ...args) => console.log(color(args));
const printBgGreen = (...args) => print(colors.bgGreen, ...args);
const printGreen = (...args) => print(colors.green, ...args);
const printRed = (...args) => print(colors.red, ...args);
const printBlue = (...args) => print(colors.blue, ...args);
const printCyan = (...args) => print(colors.cyan, ...args);
const printMagenta = (...args) => print(colors.magenta, ...args);
const printYellow = (...args) => print(colors.yellow, ...args);
const printBlack = (...args) => print(colors.black, ...args);
const printWhite = (...args) => print(colors.white, ...args);

module.exports = {
  print,
  printGreen,
  printBgGreen,
  printRed,
  printBlue,
  printCyan,
  printMagenta,
  printYellow,
  printBlack,
  printWhite,
};
