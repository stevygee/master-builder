import { config } from './config.js';

import init from './tasks/init.js';
import clean from './tasks/clean.js';
import copy from './tasks/copy.js';
import scriptsStyles from './tasks/esbuild.js';
import dist from './tasks/dist.js';
import compress from './tasks/compress.js';

const delay = ms => new Promise( res => setTimeout( res, ms ) );

async function asyncTask1() {
	await scriptsStyles();
	//console.log('task 1 done');
}

async function asyncTask2() {
	await copy();
	//console.log('task 2 done');
}

async function runScriptsStylesCopyInParallel() {
	try {
		const task1 = asyncTask1();
		const task2 = asyncTask2();

		await Promise.all( [ task1, task2 ] );
	} catch ( error ) {
		log( 'Oops! An error occurred while running tasks:', error );
	}
}

export async function performTask( taskName ) {
	switch ( taskName ) {
		case 'build':
			await init();
			await clean();
			await runScriptsStylesCopyInParallel();
			await dist();
			break;
		case 'deploy':
			await init();
			await clean();
			await runScriptsStylesCopyInParallel();
			await dist();
			await compress();
			break;
		case 'dev':
		default:
			await init();
			await clean();
			await scriptsStyles();
			await copy();
			break;
	}
}
