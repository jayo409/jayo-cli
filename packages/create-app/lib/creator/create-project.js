import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPackageJson, request, compareNPMVersion } from '@jayo-cli-suite/utils';

async function promptUser() {
  const questions = [
    {
      type: 'input',
      name: 'version',
      message: '请输入项目版本号:',
      default: '1.0.0',
      validate: function (value) {
        // 这里可以添加更复杂的验证逻辑
        const pass = value.match(
          /^[0-9]+\.[0-9]+\.[0-9]+$/
        );
        if (pass) {
          return true;
        }
        return '请输入有效的版本号（例如：1.0.0）';
      }
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入项目描述:',
      default: '一个新的项目'
    }
  ];

  const answers = await inquirer.prompt(questions);
  return answers;
}

async function checkTemplatePackVersion() {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const rootDir = path.join(__dirname, '..', '..');

    const templatePackPath = path.join(rootDir, 'node_modules', '@jayo-cli-suite', 'template-pack', 'package.json');
    const templatePackageJson = await getPackageJson(templatePackPath);

    console.log(templatePackageJson);
    const res = await compareNPMVersion('https://registry.npmjs.org/-/package/@jayo-cli-suite/template-pack/dist-tags', templatePackageJson.version)
    if (!res.isLatest) {
      console.error(
        chalk.yellow(`当前脚手架版本：${chalk.green(templatePackageJson.version)}, 最新版本：${chalk.green(res.latestVersion)}`)
      );
    }
    return null;
  } catch (err) {
    console.error(chalk.yellow(err));
  }
}

async function init() {
  const args = process.argv.slice(2); // 从第三个元素开始获取参数
  const [createName] = args;
  // const answers = await promptUser();
  checkTemplatePackVersion();
}

init();
