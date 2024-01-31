import { Command } from 'commander';
import path from 'path';
import { getPackageJson } from '@jayo-cli-suite/utils';
import createApp from '@jayo-cli-suite/create-app';

async function core() {
    const packageJson = await getPackageJson();
    const program = new Command(packageJson.name);

    program.version(packageJson.version)
        .arguments('<project-directory>')

    program
        .command('create [projectName]')
        .description('创建新的项目或元素')
        .option('-m, --microapp [name]', '创建一个新的微前端应用')
        .option('-c, --component [name]', '创建一个新的组件')
        .option('-p, --page [name]', '创建一个新的页面')
        .action((projectName, options) => {
            createApp(projectName, options);
        });

    program.parse(process.argv);
}

export default core;
