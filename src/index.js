import { config } from './config.js';

import init from './tasks/init.js';
import clean from './tasks/clean.js';
import copy from './tasks/copy.js';
import scriptsStyles from './tasks/esbuild.js';
import dist from './tasks/dist.js';
import compress from './tasks/compress.js';

import log from 'fancy-log';

async function asyncScriptModulesAndStyles() {
	await scriptsStyles( 'esm', true );
}

async function asyncScript() {
	await scriptsStyles( 'iife', false );
}

async function asyncCopy() {
	await copy();
}

async function runScriptsStylesCopyInParallel() {
	try {
		const task1 = asyncScriptModulesAndStyles();
		const task2 = asyncScript();
		const task3 = asyncCopy();

		await Promise.all( [ task1, task2, task3 ] );
	} catch ( error ) {
		log( 'Oops! An error occurred while running tasks:', error );
	}
}

async function runScriptsStylesCopyInSeries() {
	await asyncScriptModulesAndStyles();
	await asyncScript();
	await asyncCopy();
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
			await runScriptsStylesCopyInSeries();
			break;
	}
}
