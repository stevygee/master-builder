const fs = require('fs');

const configPath = `${process.cwd()}/.master-builder`;
const configFile = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : '{"builds":[{}]}';
const config = JSON.parse(configFile);

// Set mode
config.env.mode = process.argv[2] || config.env.mode;
config.env.mode = 'deploy' === config.env.mode ? 'production' : config.env.mode;

// Set package info
const pkgPath = `${process.cwd()}/package.json`;
const pkgFile = fs.existsSync(pkgPath) ? fs.readFileSync(pkgPath, 'utf-8') : '{"name":[{}]}';
const pkg = JSON.parse(pkgFile);
config.pkg = pkg;

/*console.log('Initializing Master-Builder with the following config:');
console.log(JSON.stringify(config, null, 2));*/

module.exports = config;
