const fs = require('fs-extra');

const configPath = `${process.cwd()}/.master-builder`;
const configFile = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : '{"builds":[{}]}';
const config = JSON.parse(configFile);

// Set mode
config.env.mode = process.argv[2] || config.env.mode;
config.env.mode = 'deploy' === config.env.mode ? 'production' : config.env.mode;

/*console.log('Initializing Master-Builder with the following config:');
console.log(JSON.stringify(config, null, 2));*/

module.exports = config;
