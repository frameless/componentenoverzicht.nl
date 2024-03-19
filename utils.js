import * as fs from 'node:fs';
import * as path from 'node:path';

export default function findPackageJsonFiles(directory) {
    const packageJsonFiles = [];
    const contents = fs.readdirSync(directory);

    for (const item of contents) {
        const itemPath = path.join(directory, item);
        const itemStat = fs.statSync(itemPath);

        if (itemStat.isDirectory()) {
            const nestedPackageJsonFiles = findPackageJsonFiles(itemPath);
            packageJsonFiles.push(...nestedPackageJsonFiles);
        }
        if (item === 'package.json') {
            packageJsonFiles.push(itemPath);
        }
    }
    return packageJsonFiles;
}