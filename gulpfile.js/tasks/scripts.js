const gulp = require('gulp');
const through = require('through');
const log = require('fancy-log');
const colors = require('ansi-colors');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const size = require('gulp-size');
const notifier = require('node-notifier');

// load config
const config = require('../config');

let tasks = [];

// loop through script tasks (see config) and fill an array with results from scripts functions (promises!)
for (let v of config.scripts.files) {

    // set up browserify
    const b = browserify({
        entries: v.sourceFiles,
        cache: {},
        packageCache: {},
        plugin: [watchify] // watchify!
    });

    // add transforms
    b.transform("babelify", {
        presets: ["@babel/env", "@babel/preset-react", "minify"]
    });

    // watch for events
    b.on('update', bundle);
    b.on('log', log);
    b.on('time', function () {
        if (config.env.mode === 'production') {
            b.close();
        }
    });

    // define bundle
    function bundle() {
        return b.bundle()
            .on('error', function (err) {

                // throw error to console
                log(colors.bold(colors.red(err.name + ': ' + err.message)));

                // throw notification
                notifier.notify({
                    title: 'master-builder',
                    message: 'JavaScript gone wrong.',
                    sound: 'Basso'
                });
            })
            .pipe(source(v.outputName))
            .pipe(buffer())

            // init sourcemaps
            .pipe(config.env.mode !== 'production' ? sourcemaps.init({loadMaps: true}) : through())

            .pipe(through((log(colors.white('JS files generated:')))))
            .pipe(size({title: 'Scripts:', showFiles: true}))

            // write sourcemaps (development)
            .pipe(config.env.mode !== 'production' ? sourcemaps.write('./') : through())

            .pipe(gulp.dest(v.destinationFolder))
            .pipe(browserSync.stream());
    }

    bundle.displayName = 'script:' + v.title;
    tasks.push(bundle);
}

const task = gulp.series(tasks);

gulp.task('scripts', task);
module.exports = task;
