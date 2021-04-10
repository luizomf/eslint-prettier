const path = require('path');
const { ask } = require('./utils/ask-questions');
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

breakLine();
printBgGreen('Instalação e configuração do Eslint');
breakLine();

ask(
  color.yellow(`O git está instalado? [S]im [N]ão (Padrão "N"):`),
  (answer, close) => {
    if (isNo(answer)) {
      printRed(`[N]ão selecionado!`);
      printRed(`Por favor, instale o git em seu computador.`);

      close();
      process.exit();
    }

    return startCodeExecution();
  },
);

breakLine();

const startCodeExecution = () =>
  ask(
    color.yellow(`Configurar eslint e prettier? [S]im [N]ão (Padrão "N"):`),
    (allowExecutionAnswer, close) => {
      if (isNo(allowExecutionAnswer)) {
        printRed(`[N]ão selecionado, saindo...`);
        close();
        process.exit();
        return;
      }

      return ask(
        color.yellow(`Está usando o React? [S]im [N]ão (Padrão "N"):`),
        (usingReactAnswer, _close) => {
          let usingReact = isYes(usingReactAnswer);

          return ask(
            color.yellow(`Está usando o TypeScript? [S]im [N]ão (Padrão "N"):`),
            (usingTypeScriptAnswer, close) => {
              let usingTypeScript = isYes(usingTypeScriptAnswer);

              breakLine();
              printGreen(`Ok! Estou tentando instalar os pacotes.`);
              printGreen(`Isso pode levar um tempinho, aguarde...`);

              close();

              executeNpmCommand(usingReact, usingTypeScript);
            },
          );
        },
      );
    },
  );

const executeNpmCommand = (usingReact = false, usingTypeScript = false) => {
  let npmCommand = 'npm install -D eslint eslint-config-prettier ';
  npmCommand += ' eslint-plugin-prettier prettier';

  const eslintConfigObj = require('./eslint_config_file');
  const prettierConfigObj = require('./prettier_config_file');

  if (usingReact) {
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

  if (usingTypeScript) {
    eslintConfigObj.extends = [
      ...eslintConfigObj.extends,
      'plugin:@typescript-eslint/recommended',
    ];
    eslintConfigObj.parser = '@typescript-eslint/parser';
    eslintConfigObj.plugins.push('@typescript-eslint');
    npmCommand += ' @typescript-eslint/eslint-plugin @typescript-eslint/parser';
  }

  breakLine();
  printYellow(`Eslint: configurações que foram aplicadas`);
  print(color.white, toJson(eslintConfigObj));

  breakLine();
  printYellow(`Prettier: configurações que foram aplicadas`);
  printWhite(toJson(prettierConfigObj));

  const eslintFilePath = path.resolve('.', '.eslintrc.json');
  const prettierFilePath = path.resolve('.', '.prettierrc.json');
  breakLine();

  const systemCommandCallback = (error, stdout) => {
    if (error) {
      breakLine();
      printRed(`Mais que chato, olha o erro que ocorreu:`);

      breakLine();
      printRed(`${error.message}`);

      return;
    }

    printCyan(`A instalação foi concluída:`);
    breakLine();
    printCyan(`${stdout}`);

    saveFile(eslintFilePath, eslintConfigObj);
    saveFile(prettierFilePath, prettierConfigObj);

    printGreen(`.eslintrc.json salvo em ${eslintFilePath}`);
    printGreen(`.prettierrc.json salvo em ${prettierFilePath}`);

    breakLine();
    printMagenta(`Parece que tudo correu bem!`);
    printMagenta(`Recarregue seu editor e verifique 😊!`);

    print(color.magenta, 'BYE!');

    process.exit();
  };

  runSystemCommand(npmCommand, systemCommandCallback);
};
