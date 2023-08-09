const fs = require('fs');
const path = require('path');
const packageJson: { version: string } = require('packageJsonPath');

const packageJsonPath = path.join(__dirname, 'package.json');

const versionParts = packageJson.version.split('.');
const newVersion = `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2]) + 1}`;

packageJson.version = newVersion;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');

console.log(`Bumped version to ${newVersion}`);
