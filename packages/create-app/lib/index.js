import {
    checkCreateNameEmpty,
    checkCreateNameValid,
    checkWritePermission,
    checkNodeVersion,
    checkForLatestVersion,
    // ccc
} from './check.js';
import Creator from './creator/index.js';

async function createApp(projectName, options) {
    const { createName, createType } = await checkCreateNameEmpty(projectName, options)
    checkCreateNameValid(createName, createType);
    checkWritePermission();
    checkNodeVersion();
    // await checkForLatestVersion();
    new Creator().create({createName, createType});

}

export default createApp;
