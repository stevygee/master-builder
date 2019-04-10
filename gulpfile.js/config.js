const fs = require('fs-extra');

const configPath = `${process.cwd()}/.master-builder`;
const configFile = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : '{"builds":[{}]}';
const config = JSON.parse(configFile);

/*console.log('Initializing Master-Builder with the following config:');
console.log(JSON.stringify(config, null, 2));*/

module.exports = config;
