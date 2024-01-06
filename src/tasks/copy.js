import { config } from '../config.js';

import log from 'fancy-log';
import colors from 'ansi-colors';
import cpy from 'cpy';
import path from 'path';

export async function copyFiles( files, destinationPathPrefix = '' ) {
	if ( typeof files === 'undefined' ) {
		// skip task if missing in config
		return;
	}

	// https://stackoverflow.com/a/37576787
	await Promise.all( files.map( async (v) => {
		let destinationFolder = path.resolve( destinationPathPrefix + v.destinationFolder );

		await cpy( v.sourceFiles, destinationFolder, {
			cwd: v.sourceFolder,
			parents: true,
		} ).then( (res) => {
			if ( res.length > 0 ) {
				log( `Copied ${colors.bold( `${v.title}:` )} ${colors.magenta( res.length )}` );
			}
		} ).catch( (err) => {
			log( colors.bold( colors.red( err.name + ': ' + err.message ) ) );
		} );
	} ) );
}

export default async function perform() {
	await copyFiles( config.copy );
}
