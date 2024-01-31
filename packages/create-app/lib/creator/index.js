import { execCommand } from '@jayo-cli-suite/utils';
import { fileURLToPath } from 'url';
import path from 'path';

const CREATE_TYPE_PATH = {
    project: 'create-project.js',
    page: 'create-page.js',
    microapp: 'create-microapp.js',
    component: 'create-component.js',
}

class Creator {
    constructor() {

    }

    async create(options) {
        const { createName, createType } = options;

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        // 获取当前执行文件所在目录的绝对路径
        const directoryPath = path.resolve(__dirname);
        // 构建 create 的绝对路径
        const scriptPath = path.resolve(directoryPath, CREATE_TYPE_PATH[createType]);

        const args = [createName];
        try {
            // 执行脚本
            await execCommand('node', [scriptPath, ...args]);
        } catch (error) {
            console.error(error);
        }

    }

}

export default Creator;
