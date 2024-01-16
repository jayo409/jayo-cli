const { checkProjectName } = require('./check');
function createApp(name) {

    checkProjectName(name);
    checkWritePermission();
}


module.exports = createApp;
