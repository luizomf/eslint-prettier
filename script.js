const { exec: runSystemCommand } = require('child_process');
const nodeReadLine = require('readline');
const fileSystem = require('fs');
const path = require('path');

const ask = nodeReadLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const breakLine = () => console.log();

const endColor = '\u001b[0m';
const bgGreen = (...args) => `\u001b[30m\u001b[42m${args.join(' ')}${endColor}`;
const white = (...args) => `\u001b[37m${args.join(' ')}${endColor}`;
const cyan = (...args) => `\u001b[36m${args.join(' ')}${endColor}`;
const magenta = (...args) => `\u001b[35m${args.join(' ')}${endColor}`;
const yellow = (...args) => `\u001b[33m${args.join(' ')}${endColor}`;
const green = (...args) => `\u001b[32m${args.join(' ')}${endColor}`;
const red = (...args) => `\u001b[31m${args.join(' ')}${endColor}`;
const _blue = (...args) => `\u001b[34m${args.join(' ')}${endColor}`;
const _black = (...args) => `\u001b[30m${args.join(' ')}${endColor}`;

const isYes = (answer) => answer.toLocaleLowerCase().startsWith('s');
const isNo = (answer) => !isYes(answer);
const log = (color, ...args) => console.log(color(args));

const toJson = (obj) => JSON.stringify(obj, null, 2);
const saveFile = (filePath, obj) => {
  return fileSystem.writeFileSync(filePath, toJson(obj));
};

breakLine();
log(bgGreen, 'Instalação e configuração do Eslint');
breakLine();

ask.question(
  yellow(`O git está instalado? [S]im [N]ão (Padrão "N"):`),
  (answer) => {
    if (isNo(answer)) {
      log(red, `[N]ão selecionado!`);
      log(red, `Por favor, instale o git em seu computador.`);

      ask.close();
      process.exit();
    }

    return startCodeExecution();
  },
);

breakLine();

const startCodeExecution = () =>
  ask.question(
    yellow(`Configurar eslint e prettier? [S]im [N]ão (Padrão "N"):`),
    (allowExecutionAnswer) => {
      if (isNo(allowExecutionAnswer)) {
        log(red, `[N]ão selecionado, saindo...`);
        process.exit();
        return;
      }

      return ask.question(
        yellow(`Está usando o React? [S]im [N]ão (Padrão "N"):`),
        (usingReactAnswer) => {
          let usingReact = isYes(usingReactAnswer);

          return ask.question(
            yellow(`Está usando o TypeScript? [S]im [N]ão (Padrão "N"):`),
            (usingTypeScriptAnswer) => {
              let usingTypeScript = isYes(usingTypeScriptAnswer);

              breakLine();
              log(green, `Ok! Estou tentando instalar os pacotes.`);
              log(green, `Isso pode levar um tempinho, aguarde...`);

              ask.close();

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
  log(yellow, `Eslint: configurações que foram aplicadas`);
  log(white, toJson(eslintConfigObj));

  breakLine();
  log(yellow, `Prettier: configurações que foram aplicadas`);
  log(white, toJson(prettierConfigObj));

  const eslintFilePath = path.resolve('.', '.eslintrc.json');
  const prettierFilePath = path.resolve('.', '.prettierrc.json');
  breakLine();

  const systemCommandCallback = (error, stdout) => {
    if (error) {
      breakLine();
      log(red, `Mais que chato, olha o erro que ocorreu:`);

      breakLine();
      log(red, `${error.message}`);

      return;
    }

    log(cyan, `A instalação foi concluída:`);
    breakLine();
    log(cyan, `${stdout}`);

    saveFile(eslintFilePath, eslintConfigObj);
    saveFile(prettierFilePath, prettierConfigObj);

    log(green, `.eslintrc.json salvo em ${eslintFilePath}`);
    log(green, `.prettierrc.json salvo em ${prettierFilePath}`);

    breakLine();
    log(magenta, `Parece que tudo correu bem!`);
    log(magenta, `Recarregue seu editor e verifique 😊!`);

    log(magenta, 'BYE!');

    process.exit();
  };

  runSystemCommand(npmCommand, systemCommandCallback);
};
