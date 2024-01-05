import fs from 'fs';

const configPath = `${process.cwd()}/.master-builder`;
const configFile = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : '{"builds":[{}]}';
export const config = JSON.parse(configFile);

// Set mode
config.env = {};
config.env.mode = process.argv[2] || 'development';
config.env.mode = 'development' === config.env.mode ? config.env.mode : 'production';

/*console.log('Initializing Master-Builder with the following config:');
console.log(JSON.stringify(config, null, 2));*/
