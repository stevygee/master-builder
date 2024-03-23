import { config } from '../config.js';
import { envPlugin as notifierPlugin } from '../notifier.js';

import { glob } from 'glob';

import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

import browserslist from 'browserslist';
import {
	esbuildPluginBrowserslist,
	resolveToEsbuildTarget,
} from 'esbuild-plugin-browserslist';

export default async function perform() {
	let entryPoints = [];

	// loop through files in scripts config and fill an array with entry points
	for ( let v of config.scripts.files ) {
		for ( let f of v.sourceFiles ) {
			let input = v.outputName;
			let outputName = input.substr( 0, input.lastIndexOf('.') ) || input; // remove file extension
			entryPoints.push( { in: f, out: v.destinationFolder + '/' + outputName } );
		}
	}

	// loop through files in styles config and fill an array with entry points
	for ( let v of config.styles.sourceFiles ) {
		const fileNames = await glob( v );
		for ( let f of fileNames ) {
			//entryPoints.push( f );
			let input = f;
			let outputName = input.substr( 0, input.lastIndexOf('.') ) || input; // remove file extension
			outputName = outputName.replace( 'src/', '' ); // TODO: Detect base dir??

			//console.log( { in: f, out: config.styles.destinationFolder + '/' + outputName } );
			entryPoints.push( { in: f, out: config.styles.destinationFolder + '/' + outputName } );
		}
	}

	let settings = {
		entryPoints,
		bundle: true,
		splitting: true,
		chunkNames: './js/[name]-[hash]',
		write: true,
		minify: config.env.mode === 'production',
		sourcemap: config.env.mode === 'development',
		format: 'esm',
		loader: {
			'.js': 'jsx',
		},
		external: [ '*.gif', '*.jpeg', '*.jpg', '*.png', '*.webp', '*.svg', '*.woff2', '*.woff' ],
		/*target: [
			'es2017', // TODO: Allow target override (instead of browserslist)
		],*/
		//metafile: true,
		logLevel: 'info',
		outdir: './',
		plugins: [
			esbuildPluginBrowserslist( browserslist(), {
				printUnknownTargets: false,
			} ),
			// TODO: Try different SASS plugin if source maps don't work here and browserlist won't get found
			sassPlugin( {
				embedded: true,
				//type: 'local-css',
				async transform( source, resolveDir ) {
					const { css } = await postcss( [
						autoprefixer,
						postcssPresetEnv( { stage: 0 } ),
					] ).process( source, { from: resolveDir } );
					return css;
				},
			} ),
			notifierPlugin,
		],
	};

	if ( config.env.mode === 'development' ) {
		let ctx = await esbuild.context( settings );
		await ctx.watch();
	} else {
		let result = await esbuild.build( settings );

		//console.log( await esbuild.analyzeMetafile( result.metafile ) );
	}
}
