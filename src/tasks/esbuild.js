import { config } from '../config.js';
import { envPlugin as notifierPlugin } from '../notifier.js';

import log from 'fancy-log';
import colors from 'ansi-colors';

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

	// loop through files in config and fill an array with entry points

	let inputFiles = [];
	// scripts
	if ( config.scripts.files ) {
		inputFiles.push( ...config.scripts.files );
	}
	// styles
	if ( config.styles.files ) {
		inputFiles.push( ...config.styles.files );
	}

	let legacyScriptsCount = 0;
	let legacyStylesCount  = 0;

	// scripts: legacy mode
	if ( config.scripts.files ) {
		for ( let v of config.scripts.files ) {
			// uses new format, skip
			if ( 'sourceFolder' in v ) {
				//console.log('skip in legacy mode', v.outputName);
				continue;
			}

			for ( let f of v.sourceFiles ) {
				let input = v.outputName;
				let outputName = input.substr( 0, input.lastIndexOf('.') ) || input; // remove file extension

				entryPoints.push( { in: f, out: v.destinationFolder + '/' + outputName } );
				legacyScriptsCount++;
			}
		}
	}

	// styles: legacy mode
	if ( config.styles.sourceFiles ) {
		for ( let v of config.styles.sourceFiles ) {
			const fileNames = await glob( v );
			for ( let f of fileNames ) {
				let input = f;
				let outputName = input.substr( 0, input.lastIndexOf('.') ) || input; // remove file extension
				outputName = outputName.replace( 'src/', '' ); // Assume base dir (known limitation)

				entryPoints.push( { in: f, out: config.styles.destinationFolder + '/' + outputName } );
				legacyStylesCount++;
			}
		}
	}

	if ( legacyScriptsCount > 0 ) {
		log( colors.bold( colors.red( `Building ${legacyScriptsCount} scripts in legacy format, consider updating your config.` ) ) );
	}

	if ( legacyStylesCount > 0 ) {
		log( colors.bold( colors.red( `Building ${legacyStylesCount} styles in legacy format, consider updating your config.` ) ) );
	}

	// collect entry points
	if ( inputFiles ) {
		for ( let v of inputFiles ) {
			// doesn't use new format, skip
			if ( ! 'sourceFolder' in v ) {
				//console.log('skip in new mode', v.outputName);
				continue;
			}

			let outputPattern = v.outputName;
			outputPattern = outputPattern.substr( 0, outputPattern.lastIndexOf('.') ) || outputPattern; // remove file extension

			for ( let v2 of v.sourceFiles ) {
				const filePath = v.sourceFolder + v2;
				const fileNames = await glob( filePath );

				for ( let f of fileNames ) {
					let outputName = './' + f;
					outputName = outputName.replace( v.sourceFolder, '' ); // remove base dir
					outputName = outputName.substr( 0, outputName.lastIndexOf('.') ) || outputName; // remove file extension
					outputName = outputPattern.replace( '[name]', outputName ); // apply pattern
					outputName = v.destinationFolder + '/' + outputName; // add dest dir

					//console.log('entryPoints', { in: f, out: outputName });
					entryPoints.push( { in: f, out: outputName } );
				}
			}
		}
	}

	let settings = {
		entryPoints,
		bundle: true,
		splitting: config.scripts.chunkNames ? true : false,
		chunkNames: config.scripts.chunkNames ? config.scripts.chunkNames : './js/[name]-[hash]',
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
