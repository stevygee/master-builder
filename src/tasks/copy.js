import { config } from '../config.js';

import log from 'fancy-log';
import colors from 'ansi-colors';

import cpy from 'cpy';
import path from 'path';
import { glob } from 'glob';
import { watchFile } from 'node:fs';
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

async function copyFile( f, files ) {
	const fileExists = await stat( f )
		.then(() => true)
		.catch(() => false);

	// File was deleted, there is nothing to copy
	if ( ! fileExists ) {
		return;
	}

	// Get absolute path
	let includePaths = [];
	includePaths.push( path.resolve( f ) );

	// Copy only changed file
	await copyFiles( files, '', includePaths );
}

export default async function perform() {
	if ( typeof config.copy === 'undefined' ) {
		// skip task if missing in config
		return;
	}

	await copyFiles( config.copy );

	// Watch files
	for ( let v2 of config.copy ) {
		for ( let v of v2.sourceFiles ) {
			const filePath = v2.sourceFolder.endsWith( '/' ) ? v2.sourceFolder + v : v2.sourceFolder + '/' + v;
			const fileNames = await glob( filePath );

			for ( let f of fileNames ) {
				watchFile( f, (curr, prev) => {
					log( `File changed: ${colors.magenta( f )}` );
					copyFile( f, config.copy );
				} );
			}
		}
	}
}
