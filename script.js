console.log('');
const { exec } = require('child_process');
console.log(
  ` \u001b[30m\u001b[42m Instalação e configuração do Eslint \u001b[0m`,
);

const readline = require('readline');
const fs = require('fs');
var path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('');
rl.question(
  `\u001b[36m Configurar eslint e prettier? [S]im [N]ão (Padrão "N"): \u001b[0m`,
  (answer) => {
    if (!answer.toLocaleLowerCase().startsWith('s')) {
      console.log(`\u001b[31m [N]ão selecionado, saindo...\u001b[0m `);
      process.exit();
    }

    return rl.question(
      `\u001b[36m Está usando o React? [S]im [N]ão (Padrão "N"): \u001b[0m`,
      (answer) => {
        let react = answer.toLocaleLowerCase().startsWith('s');

        return rl.question(
          `\u001b[36m Está usando o TypeScript? [S]im [N]ão (Padrão "N"): \u001b[0m`,
          (answer) => {
            let typescript = answer.toLocaleLowerCase().startsWith('s');

            console.log();
            console.log(
              `\u001b[32;1m Ok! Estou tentando instalar os pacotes. \u001b[0m`,
            );
            console.log(
              `\u001b[32;1m Isso pode levar um tempinho, aguarde... \u001b[0m`,
            );

            rl.close();

            execute(react, typescript);
          },
        );
      },
    );
  },
);

const execute = (react = false, typescript = false) => {
  let command = 'npm install -D eslint eslint-config-prettier ';
  command += ' eslint-plugin-prettier prettier';

  const eslintrc = require('./eslint_config_file');
  const prettierc = require('./prettier_config_file');

  if (react) {
    eslintrc.extends = [
      ...eslintrc.extends,
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ];
    eslintrc.settings = {
      react: {
        version: 'detect',
      },
    };
    eslintrc.plugins.push('react');
    command += ' eslint-plugin-react eslint-plugin-react-hooks ';
  }

  if (typescript) {
    eslintrc.extends = [
      ...eslintrc.extends,
      'plugin:@typescript-eslint/recommended',
    ];
    eslintrc.parser = '@typescript-eslint/parser';
    eslintrc.plugins.push('@typescript-eslint');
    command += ' @typescript-eslint/eslint-plugin @typescript-eslint/parser ';
  }

  console.log();
  console.log(
    `\u001b[32;1m Eslint: configurações que foram aplicadas \u001b[0m`,
  );
  console.log(eslintrc);

  console.log();
  console.log(
    `\u001b[32;1m Prettier: configurações que foram aplicadas \u001b[0m`,
  );
  console.log(prettierc);

  const eslintPath = path.resolve('.', '.eslintrc.json');
  const prettierPath = path.resolve('.', '.prettierrc.json');
  console.log();

  const callback = (error, stdout) => {
    if (error) {
      console.log();
      console.log(
        `\u001b[31m Mais que chato, olha o erro que ocorreu:\u001b[0m`,
      );
      console.log();
      console.log(`\u001b[31m ${error.message}\u001b[0m`);
      return;
    }

    // if (stderr) {
    //   console.log(`\u001b[31m Error: ${stderr}\u001b[0m`);
    //   return;
    // }

    console.log(`\u001b[32;1m A instalação foi concluída: \u001b[0m`);
    console.log();
    console.log(`${stdout}`);

    fs.writeFileSync(eslintPath, JSON.stringify(eslintrc, null, 2));
    fs.writeFileSync(prettierPath, JSON.stringify(prettierc, null, 2));

    console.log(`\u001b[32;1m .eslintrc.json salvo em ${eslintPath} \u001b[0m`);

    console.log(
      `\u001b[32;1m .prettierrc.json salvo em ${prettierPath} \u001b[0m`,
    );

    console.log();
    console.log(`\u001b[32;1m Parece que tudo correu bem! \u001b[0m`);
    console.log(`\u001b[32;1m Recarregue seu editor e verifique 😊! \u001b[0m`);

    console.log(' BYE!');

    process.exit();
  };

  exec(command, callback);
};
