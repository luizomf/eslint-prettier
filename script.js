const path = require('path');
const { askPromise } = require('./utils/ask-questions');
const color = require('./utils/color-functions');
const { saveFile } = require('./utils/save-file');
const toJson = require('./utils/to-json');
const { isYes, isNo } = require('./utils/yes-no-answer');
const {
  print,
  printBgGreen,
  printRed,
  printGreen,
  printYellow,
  printWhite,
  printCyan,
  printMagenta,
} = require('./utils/print');
const { breakLine } = require('./utils/break-line');
const { runSystemCommand } = require('./utils/run-system-command');

const Y = 'Y';
const N = 'N';
const yesNoPhrase = color.cyan(`[${Y}]es [${N}]o (Default "${N}"): `);

breakLine();
printBgGreen('Instalação e configuração do Eslint');
breakLine();

askPromise
  .question(color.yellow(`Is "Git" installed? ${yesNoPhrase}`))
  .then((answer) => {
    askPromise.answers = { ...askPromise.answers, gitInstalled: answer };
    if (isNo(answer)) {
      printRed(`[N]o selected!`);
      printRed(`Please, install git from https://git-scm.com/downloads.`);
      process.exit();
    }

    return askPromise.question(
      color.yellow(`Install and configure Eslint and Prettier? ${yesNoPhrase}`),
    );
  })
  .then((answer) => {
    askPromise.answers = { ...askPromise.answers, allowExecution: answer };

    if (isNo(answer)) {
      printRed(`[N]o selected!`);
      askPromise.close();
      process.exit();
      return;
    }

    return askPromise.question(
      color.yellow(`Do you use React? ${yesNoPhrase}`),
    );
  })
  .then((answer) => {
    let usingReact = isYes(answer);
    askPromise.answers = { ...askPromise.answers, usingReact };

    return askPromise.question(
      color.yellow(`Do you use TypeScript? ${yesNoPhrase}`),
    );
  })
  .then((usingTypeScriptAnswer) => {
    let usingTypeScript = isYes(usingTypeScriptAnswer);
    askPromise.answers = { ...askPromise.answers, usingTypeScript };

    breakLine();
    printGreen(`Ok! Trying to install packages.`);
    printGreen(`This may take a while. Please wait...`);

    askPromise.close();

    executeNpmCommand();
  });

breakLine();

const executeNpmCommand = () => {
  let npmCommand = 'npm install -D eslint eslint-config-prettier ';
  npmCommand += ' eslint-plugin-prettier prettier';

  const eslintConfigObj = require('./eslint_config_file');
  const prettierConfigObj = require('./prettier_config_file');

  if (askPromise.answers.usingReact) {
    eslintConfigObj.extends = [
      ...eslintConfigObj.extends,
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ];
    eslintConfigObj.settings = {
      react: {
        version: 'detect',
      },
    };
    eslintConfigObj.plugins.push('react');
    npmCommand += ' eslint-plugin-react eslint-plugin-react-hooks ';
  }

  if (askPromise.answers.usingTypeScript) {
    eslintConfigObj.extends = [
      ...eslintConfigObj.extends,
      'plugin:@typescript-eslint/recommended',
    ];
    eslintConfigObj.parser = '@typescript-eslint/parser';
    eslintConfigObj.plugins.push('@typescript-eslint');
    npmCommand += ' @typescript-eslint/eslint-plugin @typescript-eslint/parser';
  }

  breakLine();
  printYellow(`Eslint configuration to be applied: `);
  print(color.white, toJson(eslintConfigObj));

  breakLine();
  printYellow(`Prettier configuration to be applied: `);
  printWhite(toJson(prettierConfigObj));

  const eslintFilePath = path.resolve('.', '.eslintrc.json');
  const prettierFilePath = path.resolve('.', '.prettierrc.json');
  breakLine();

  const systemCommandCallback = (error, stdout) => {
    if (error) {
      breakLine();
      printRed(`An error occurred:`);

      breakLine();
      printRed(`${error.message}`);

      process.exit();
      return;
    }

    printCyan(`Installation completed:`);
    breakLine();
    printCyan(`${stdout}`);

    saveFile(eslintFilePath, eslintConfigObj);
    saveFile(prettierFilePath, prettierConfigObj);

    printGreen(`.eslintrc.json saved: ${eslintFilePath}`);
    printGreen(`.prettierrc.json saved: ${prettierFilePath}`);

    breakLine();
    printMagenta(`Seems like everything is fine!`);
    printMagenta(`You may need to reload your editor 😊!`);

    print(color.magenta, 'BYE!');

    process.exit();
    return;
  };

  runSystemCommand(npmCommand, systemCommandCallback);
};
