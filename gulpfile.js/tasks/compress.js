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

config.dist.packageFolder = config.dist.distRoot + "/packages/" + config.dist.packageName;
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

if ( typeof config.dist.files === 'undefined' ) {
    // skip task if missing in config
    const emptyTask = () => { return gulp.src('.'); }
    tasks.push(emptyTask);
} else {
    // loop through copy tasks (see config) and fill an array with results from copy functions (promises!)
    for (let v of config.dist.files) {
    	let destinationFolder = config.dist.packageFolder + v.destinationFolder;
        const copyTask = () => copy(v.sourceFiles, path.resolve(destinationFolder), {
            cwd: v.sourceFolder,
            parents: true
        }).then((res) => {
            if (res.length > 0) {
                log(colors.white('Copied ' + v.title + ': ' + colors.magenta(res.length)));
            }
        }).catch((err) => {
            // throw error to console
            log(colors.bold(colors.red(err.name + ': ' + err.message)));
        });

        copyTask.displayName = 'copy:' + v.title;
        tasks.push(copyTask);
    }
}

const readmeTask = (done) => {
	let hasErrors = false; // init

	// Put readme in dist root
	return gulp.src(config.dist.readmeName)
		.pipe(rename( { prefix: config.dist.packageName + '-' }))
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
		.pipe(gulp.dest(config.dist.distRoot));
};

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

tasks.push(readmeTask);
tasks.push(zipTask);
tasks.push(cleanTask);
const task = gulp.series(tasks);

gulp.task('compress', task);
module.exports = task;
