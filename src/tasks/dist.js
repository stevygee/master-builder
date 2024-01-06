import { config } from '../config.js';
import { copyFiles } from './copy.js';

import log from 'fancy-log';
import colors from 'ansi-colors';
import cpy from 'cpy';

export default async function perform() {
	let destPathPrefix = config.dist.distRoot + "/packages/" + config.dist.packageName;

	// Copy files to package dir
	await copyFiles( config.dist.files, destPathPrefix );

	// Copy readme file
	await cpy( config.dist.readmeName, config.dist.distRoot, {
		// Add package name to filename
		rename: basename => `${config.dist.packageName}-${basename}`,
	} ).then( (res) => {
		log( `Copied ${colors.bold( `readme:` )} ${colors.magenta( res.length )}` );
	} ).catch( (err) => {
		log( colors.bold( colors.red( err.name + ': ' + err.message ) ) );
	} );
}
