import { config } from '../config.js';

import log from 'fancy-log';
import colors from 'ansi-colors';
import { deleteAsync } from 'del';

export default async function perform() {
	const cleanableTasks = [
		"scripts",
		"styles",
		"dist"
	];

	// Collect paths to clean from other tasks
	let collectedPaths = [];
	for ( let v of cleanableTasks ) {
		collectedPaths.push( ...config[v].cleanFiles );
	}

	// Delete all paths in one go
	await deleteAsync( collectedPaths ).then( (res) => {
		log( `Cleaned ${colors.magenta( res.length )} files` );
	} ).catch( (err) => {
		log( colors.bold( colors.red( err.name + ': ' + err.message ) ) );
	} );
}
