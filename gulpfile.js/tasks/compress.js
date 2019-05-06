const gulp = require('gulp');
const rename = require('gulp-rename');
const through = require('through');
const del = require('del');
const zip = require('gulp-zip');
const log = require('fancy-log');
const colors = require('ansi-colors');
const size = require('gulp-size');
const notifier = require('node-notifier');

// load config
const config = require('../config');

const readmeTask = (done) => {
	let hasErrors = false; // init

	// Put readme in dist root
	return gulp.src(config.dist.readmeName)
		.pipe(rename( { prefix: 'gulp-example-' }))
		.on('error', function (err) {

			// mark errors
			hasErrors = true;

			// throw error to console
			log(colors.bold(colors.red(err.name + ': ' + err.message)));

			// throw notification
			notifier.notify({
				title: 'master-builder',
				message: 'Compress gone wrong.',
				sound: 'Basso'
			});

			// continue gulp task
			done();
		})
		// log
		.pipe(!hasErrors ? through(log(colors.white('Text files copied:'))) : through())
		.pipe(size({title: 'Readme:', showFiles: true}))

		// save
		.pipe(gulp.dest(config.dist.readmeFolder));
};

const zipTask = (done) => {
	let hasErrors = false; // init

	// Compress subfolder
	return gulp.src(config.dist.archiveFolder + '/**/*', {base: config.dist.archiveFolder})
		.pipe(zip(config.dist.archiveName))
		.on('error', function (err) {

			// mark errors
			hasErrors = true;

			// throw error to console
			log(colors.bold(colors.red(err.name + ': ' + err.message)));

			// throw notification
			notifier.notify({
				title: 'master-builder',
				message: 'Compress gone wrong.',
				sound: 'Basso'
			});

			// continue gulp task
			done();
		})
		// log
		.pipe(!hasErrors ? through(log(colors.white('ZIP files generated:'))) : through())
		.pipe(size({title: 'Archive:', showFiles: true}))
		
		// save
		.pipe(gulp.dest(config.dist.archiveFolder));
};

const cleanTask = (done) => {
	// Clean compressed
	return del([config.dist.packageFolder + '/**']);
};

const task = gulp.series(readmeTask, zipTask, cleanTask);

gulp.task('compress', task);
module.exports = task;
