import { config } from '../config.js';

import log from 'fancy-log';
import colors from 'ansi-colors';
import vfs from 'vinyl-fs';
import zip from 'gulp-zip';
import size from 'gulp-size';
import { deleteAsync } from 'del';

export default async function perform() {
	const archiveFolder = config.dist.distRoot + "/packages";

	// Compress package dir
	await new Promise( (resolve, reject) => {
		// Use vinyl-fs to run gulp-zip
		// https://stackoverflow.com/a/69155787
		vfs.src( archiveFolder + '/**/*', { base: archiveFolder } )
			.pipe( zip( config.dist.packageName + '.zip' ) )
			.pipe( size( { title: 'ZIP file generated:', showFiles: true } ) )
			.pipe( vfs.dest( archiveFolder ) )
			.on( 'finish', resolve )
			.on( 'error', reject );
	} );

	// Clean everything but the readme and the zip
	await deleteAsync( [
		config.dist.distRoot + "/**",
		config.dist.distRoot + "/packages/**",
		"!" + config.dist.distRoot,
		"!" + config.dist.distRoot + "/" + config.dist.packageName + "-readme.txt",
		"!" + config.dist.distRoot + "/packages",
		"!" + config.dist.distRoot + "/packages/" + config.dist.packageName + ".zip"
	] ).then( (res) => {
		log( `Cleaned ${colors.magenta( res.length )} files` );
	} ).catch( (err) => {
		log( colors.bold( colors.red( err.name + ': ' + err.message ) ) );
	} );
}
