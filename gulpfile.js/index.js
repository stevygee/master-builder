const gulp = require('gulp');
const requireDir = require('require-dir');

// load config
const config = require('./config');

// Require all tasks in gulpfile.js/tasks, including subfolders
requireDir('./tasks', { recurse: true });

// define sequences
const tasks = {};
tasks.development = gulp.series(
    'init',
    'clean',
    'styles',
    'scripts',
    'images',
    'templates',
    'copy',
    'watch',
    'browserSync'
);
tasks.production = gulp.series(
    'init',
    'clean',
    // run tasks in parallel because production mode can be much slower
    gulp.parallel(
        'styles',
        'scripts',
        'images',
        'templates',
        'copy'
    )
);

// define tasks
gulp.task('development', tasks.development);
gulp.task('production', tasks.production);

// define default alias (use from ENV)
gulp.task('default', tasks[config.env.mode]);
