import colors from 'ansi-colors';
import asciify from 'asciify';

import { config } from '../config.js';

import { readFile } from 'fs/promises';
const pkg = JSON.parse(
	await readFile(
		new URL( '../../package.json', import.meta.url )
	)
);

export default function perform() {
	let mode = config.env.mode === 'production' ? 'Production' : 'Development';
	let color = config.env.mode === 'production' ? 'red' : 'blue';
	let version = 'v' + pkg.version;

	console.log( colors.white( '\n ' + mode + version.padStart( 51, ' ' ) ) );

	// bring out some ASCII art
	asciify( 'MASTER BUILDER', {
		font: 'cybermedium',
		color: color,
	}, ( err, res ) => {
		console.log( res );
	} );
}
