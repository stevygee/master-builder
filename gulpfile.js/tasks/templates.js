const fs = require('fs-extra');
const gulp = require('gulp');
const through = require('through');
const log = require('fancy-log');
const colors = require('ansi-colors');
const handlebars  = require('gulp-compile-handlebars');
const browserSync = require('browser-sync');
const notifier = require('node-notifier');
const plumber = require('gulp-plumber');
const count = require('gulp-count');

// load config
const config = require('../config');

const task = () => {
	let hasErrors = false; // init

	// skip task if missing in config
	if ( typeof config.templates === 'undefined' ) {
		return gulp.src('.');
	}

	const contentFile = fs.existsSync(config.templates.contentFile) ? fs.readFileSync(config.templates.contentFile, 'utf-8') : '{}';
	const content = JSON.parse(contentFile);

	var templateData = {
		content: content
	};

	return gulp.src(config.templates.sourceFiles)

		// prevent pipe breaking caused by errors
		.pipe(plumber())

		// compile handlebars templates
		.pipe(handlebars(
			templateData,
			{
				batch: config.templates.partialsFolder,
				helpers: {
					times : function(n, block) {
						var accum = '';
						for(var i = 0; i < n; ++i)
							accum += block.fn(i);
						return accum;
					}
				}
			}
		))
		.on('error', (err) => {

			// mark errors
			hasErrors = true;

			// throw error to console
			log(colors.bold(colors.red(err.name + ': ' + err.message)));

			// throw notification
			notifier.notify({
					title: 'master-builder',
					message: 'Templates gone wrong.',
					sound: 'Basso'
			});
		})

		// stop error prevention
		.pipe(plumber.stop())

		// log
		.pipe(!hasErrors ? count({
				message: colors.white('HTML files generated from templates: <%= counter %>'),
				logger: (message) => log(message)
		}) : through())

		// save
		.pipe(gulp.dest(config.templates.destinationFolder))

		// reload browser
		.pipe(browserSync.stream());
};

gulp.task('templates', task);
module.exports = task;
