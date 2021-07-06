const gulp = require('gulp');
const through = require('through');
const log = require('fancy-log');
const colors = require('ansi-colors');
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const customProperties = require('postcss-custom-properties');
const cssnano = require('cssnano');
const size = require('gulp-size');
const plumber = require('gulp-plumber');
const notifier = require('node-notifier');

// load config
const config = require('../config');

const task = (done) => {
    let hasErrors = false; // init

    const postcssPlugins = [
        customProperties(),
        autoprefixer() // autoprefixer uses config from .browserslistrc
    ];

    // compress (production)
    if (config.env.mode === 'production') {
        postcssPlugins.push(cssnano(config.cssnano));
    }

    return gulp.src(config.styles.sourceFiles)

        // init sourcemaps
        .pipe(config.env.mode !== 'production' ? sourcemaps.init() : through())

        // prevent pipe breaking caused by errors
        .pipe(plumber())

        // glob partials (use wildcard * for imports)
        .pipe(sassGlob())

        // compile sass
        .pipe(sass())
        .on('error', function (err) {

            // mark errors
            hasErrors = true;

            // throw error to console
            log(colors.bold(colors.red(err.name + ': ' + err.message)));

            // throw notification
            notifier.notify({
                title: 'master-builder',
                message: 'Styles gone wrong.',
                sound: 'Basso'
            });

            // continue gulp task
            done();
        })

        // run postcss plugins
        .pipe(postcss(postcssPlugins))

        // stop error prevention
        .pipe(plumber.stop())

        // log
        .pipe(!hasErrors ? through(log(colors.white('CSS files generated:'))) : through())
        .pipe(size({title: 'Styles:', showFiles: true}))

        // write sourcemaps (development)
        .pipe(config.env.mode !== 'production' ? sourcemaps.write('.') : through())

        // save
        .pipe(gulp.dest(config.styles.destinationFolder));
};

gulp.task('styles', task);
module.exports = task;
