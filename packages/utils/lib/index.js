import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';
import request from './request.js';

async function getPackageJson(packageJsonPath = '') {
    console.log(packageJsonPath);
    try {
        if (!packageJsonPath) {
            // 如果没有提供包名，使用当前目录的 package.json
            packageJsonPath = path.join(process.cwd(), 'package.json');
        }
        // 读取并解析 package.json
        const packageJsonRaw = await fs.readFile(packageJsonPath, 'utf8');
        return JSON.parse(packageJsonRaw);
    } catch (error) {
        console.error(`Error reading package.json for ${'current project'}:`, error);
        return null;
    }
}

/**
 * 执行外部命令的函数
 * @param {string} command 要执行的命令
 * @param {string[]} args 命令的参数数组
 * @param {Object} options 可选的配置对象
 */
function execCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, { stdio: 'inherit', ...options });

        child.on('close', code => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`命令 "${command}" 执行失败 : ${code}`));
            }
        });

        child.on('error', err => {
            reject(err);
        });
    });
}

/**
 * 比对本地和npm上的版本
 * @param {string} npm 
 * @param {string} currentVersion 
 * @returns 
 */
async function compareNPMVersion(npm, currentVersion) {
    const queryLatestVersion = () => request.get('https://registry.npmjs.org/-/package/@jayo-cli-suite/create-app/dist-tags');
    try {
        const { data } = await queryLatestVersion();
        const latest = data.latest;
        if (latest && semver.lt(currentVersion, latest)) {
            return {
                latestVersion: latest,
                isLatest: false
            }
        } else {
            return {
                latestVersion: latest,
                isLatest: true
            }
        }
    } catch (err) {
        return '无法检查最新版本';
    }
}

export {
    getPackageJson,
    execCommand,
    compareNPMVersion,
    request
}