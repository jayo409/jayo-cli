import chalk from 'chalk';
import validateProjectName from 'validate-npm-package-name';
import fs from 'fs';
import path from 'path';
import https from 'https';
import semver from 'semver';
import inquirer from 'inquirer';
import { getPackageJson, request, compareNPMVersion } from '@jayo-cli-suite/utils';

const CREATE_TYPE_TEXT = {
    page: '页面',
    component: '组件',
    microapp: '子应用',
    project: '项目'
}

/**
 * 判断名字是否为空
 * @param {*} projectName 
 * @param {*} options 
 * @returns 
 */
async function checkCreateNameEmpty(projectName, options) {
    let createName = '';
    let createType = 'project';

    if (options.page) {
        createName = typeof options.page === 'boolean' ? '' : options.page;
        createType = 'page';
    } else if (options.component) {
        createName = typeof options.component === 'boolean' ? '' : options.component;
        createType = 'page';
    } else if (options.microapp) {
        createName = typeof options.microapp === 'boolean' ? '' : options.microapp;
        createType = 'page';
    } else {
        createName = projectName;
        createType = 'project';
    }

    // 如果名称未提供，提示用户输入
    if (!createName) {
        createName = (await inquirer.prompt([
            {
                type: 'input',
                name: 'createName',
                message: `请输入${CREATE_TYPE_TEXT[createType]}名称:`
            }
        ])).createName;
    }

    // 如果用户还是没有提供名称，抛出错误
    if (!createName) {
        throw new Error(`${CREATE_TYPE_TEXT[createType]}名称是必需的`);
        console.error(chalk.red(`请输入${CREATE_TYPE_TEXT[createType]}名称`));
        process.exit(1);
    }

    return { createName, createType };
}

/**
 * 检查项目名称是否合法
 * @param {*} createName 
 */
function checkCreateNameValid(createName, createType) {
    const validationResult = validateProjectName(createName);
    if (!validationResult.validForNewPackages) {
        console.error(chalk.red(`检查${CREATE_TYPE_TEXT[createType]}名称 ${chalk.green(`"${createName}"`)} 不合法`));
        process.exit(1);
    }

    const projectPath = path.join(process.cwd(), createName);
    // 检查目录是否存在
    if (fs.existsSync(projectPath)) {
        // 读取目录中的文件
        const files = fs.readdirSync(projectPath);

        // 如果目录不为空，则报错
        if (files.length > 0) {
            console.error(chalk.red(`目录 ${chalk.green(createName)} 已存在且不为空`));
            process.exit(1);
        }
    }
}

/**
 * 检查目录写入权限
 */
function checkWritePermission() {
    try {
        fs.accessSync(process.cwd(), fs.constants.W_OK);
    } catch (err) {
        console.error(chalk.red('没有写入当前目录的权限'));
        process.exit(1);
    }
}

/**
 * node版本检查
 */
async function checkNodeVersion() {
    const packageJson = await getPackageJson();
    const packageName = packageJson.name;
    const packageJsonPath = path.resolve(
        process.cwd(),
        'node_modules',
        packageName,
        'package.json'
    );

    if (!fs.existsSync(packageJsonPath)) {
        return;
    }

    if (!packageJson.engines || !packageJson.engines.node) {
        return;
    }

    if (!semver.satisfies(process.version, packageJson.engines.node)) {
        console.error(
            chalk.red(`当前node版本过低 请升级到 ${chalk.green(packageJson.engines.node)} 以上版本`),
            process.version,
            packageJson.engines.node
        );
        process.exit(1);
    }
}

/**
 * 检查最新版本
 * @returns 
 */
async function checkForLatestVersion() {
    try {
        const packageJson = await getPackageJson();
        const res = await compareNPMVersion('https://registry.npmjs.org/-/package/@jayo-cli-suite/create-app/dist-tags', packageJson.version)
        if (!res.isLatest) {
            console.error(
                chalk.yellow(`当前脚手架版本：${chalk.green(packageJson.version)}, 最新版本：${chalk.green(res.latestVersion)}`)
            );
        }
        return null;
    } catch (err) {
        console.error(chalk.yellow(err));
    }
}

export {
    checkCreateNameEmpty,
    checkCreateNameValid,
    checkWritePermission,
    checkNodeVersion,
    checkForLatestVersion
};
