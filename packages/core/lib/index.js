const commander = require('commander');

const createApp = require('create-app');
const packageJson = require('../package.json');

function core() {
    let projectName;
    const program = new commander.Command(packageJson.name);
    program.version(packageJson.version)
        .arguments('<project-directory>')

    program
        .command('create [projectName]')
        .action(createApp);

    program.parse(process.argv);
}

module.exports = core;
