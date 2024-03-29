import { config } from '../config.js';

import log from 'fancy-log';
import colors from 'ansi-colors';

import cpy from 'cpy';
import path from 'path';
import { watch } from 'node:fs';
import { stat } from 'fs/promises';

export async function copyFiles( files, destinationPathPrefix = '', includePaths = [] ) {
	if ( typeof files === 'undefined' ) {
		// skip task if missing in config
		return;
	}

	// https://stackoverflow.com/a/37576787
	await Promise.all( files.map( async (v) => {
		let destinationFolder = path.resolve( destinationPathPrefix + v.destinationFolder );

		await cpy( v.sourceFiles, destinationFolder, {
			// copy only files in includePath, if set
			filter: file => includePaths.length < 1 ? true : includePaths.includes( file.path ),
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

async function copyFile( dir, filename, allFiles ) {
	let filepath = path.resolve( dir, filename );

	const fileExists = await stat( filepath )
		.then(() => true)
		.catch(() => false);

	// File was deleted, there is nothing to copy
	if ( ! fileExists ) {
		return;
	}

	// Get absolute path
	let includePaths = [ filepath ];

	// Copy only changed file
	await copyFiles( allFiles, '', includePaths );
}

export default async function perform() {
	if ( typeof config.copy === 'undefined' ) {
		// skip task if missing in config
		return;
	}

	await copyFiles( config.copy );

	if ( config.env.mode !== 'development' ) {
		return;
	}

	// Watch folders
	for ( let v of config.copy ) {
		watch( v.sourceFolder, ( eventType, filename ) => {
			// Only process events containing a filename
			if ( filename ) {
				log( `File changed: ${colors.magenta( filename )}` );
				copyFile( v.sourceFolder, filename, config.copy );
			}
		} );
	}
}
