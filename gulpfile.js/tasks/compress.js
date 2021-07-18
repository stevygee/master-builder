const gulp = require('gulp');
const rename = require('gulp-rename');
const through = require('through');
const del = require('del');
const copy = require('cpy');
const path = require('path');
const zip = require('gulp-zip');

const log = require('fancy-log');
const colors = require('ansi-colors');
const size = require('gulp-size');
const notifier = require('node-notifier');

// load config
const config = require('../config');

config.dist.archiveFolder = config.dist.distRoot + "/packages";
config.dist.postCleanFiles = [ // clean everything but the readme and the zip
	config.dist.distRoot + "/**",
	config.dist.distRoot + "/packages/**",
	"!" + config.dist.distRoot,
	"!" + config.dist.distRoot + "/" + config.dist.packageName + "-readme.txt",
	"!" + config.dist.distRoot + "/packages",
	"!" + config.dist.distRoot + "/packages/" + config.dist.packageName + ".zip"
];

let tasks = [];

const zipTask = (done) => {
	let hasErrors = false; // init

	// Compress subfolder
	return gulp.src(config.dist.archiveFolder + '/**/*', {base: config.dist.archiveFolder})
		.pipe(zip(config.dist.packageName + '.zip'))
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
	return del(config.dist.postCleanFiles);
};

tasks.push(zipTask);
tasks.push(cleanTask);
const task = gulp.series(tasks);

gulp.task('compress', task);
module.exports = task;
