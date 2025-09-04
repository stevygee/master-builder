import fs from 'fs';

const configNameArg = process.argv[3] && process.argv[3].startsWith('config=') ? process.argv[3].substr('config='.length) : false;
const configName    = configNameArg || '.master-builder';

if ( configNameArg ) {
	console.log('Using config file: ' + configName);
}

const configPath = `${process.cwd()}/${configName}`;
const configFile = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf-8') : '{"builds":[{}]}';
export const config = JSON.parse(configFile);

// Set mode
config.env = {};
config.env.mode = process.argv[2] || 'development';
config.env.mode = 'development' === config.env.mode ? config.env.mode : 'production';

/*console.log('Initializing Master-Builder with the following config:');
console.log(JSON.stringify(config, null, 2));*/
