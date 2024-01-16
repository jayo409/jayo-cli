const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs');
const path = require('path');

/**
 * 检查项目名称
 * @param {*} projectName 
 */
function checkProjectName(projectName) {
    if (typeof projectName === 'undefined') {
        console.error(chalk.red('请输入项目名称'));
        process.exit(1);
    }

    const validationResult = validateProjectName(projectName);
    if (!validationResult.validForNewPackages) {
        console.error(chalk.red(`检查项目名称${chalk.green(`"${projectName}"`)}不合法`));
        process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
        console.error(chalk.blue(`目录 ${projectName} 已存在`));
        process.exit(1);
    }
}

/**
 * 检查目录写入权限
 */
function checkWritePermission() {
    try {
        fs.accessSync(process.cwd(), fs.constants.W_OK);
    } catch (err) {
        console.error(chalk.blue('没有写入当前目录的权限'));
        process.exit(1);
    }
}

module.exports = {
    checkProjectName,
    checkWritePermission
}
