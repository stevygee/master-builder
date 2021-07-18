const gulp = require('gulp');
const requireDir = require('require-dir');

// load config
const config = require('./config');

// Require all tasks in gulpfile.js/tasks, including subfolders
requireDir('./tasks', { recurse: true });

// define sequences
const tasks = {};
tasks.dev = gulp.series(
    'init',
    'clean',
    'styles',
    'scripts',
    'copy',
    'watch'
);
tasks.build = gulp.series(
    'init',
    'clean',
    // run tasks in parallel because production mode can be much slower
    gulp.parallel(
        'styles',
        'scripts',
        'copy'
    ),
    'dist'
);
tasks.deploy = gulp.series(
    'init',
    'clean',
    // run tasks in parallel because production mode can be much slower
    gulp.parallel(
        'styles',
        'scripts',
        'copy'
    ),
    'dist',
    'compress'
);

// define tasks
gulp.task('dev', tasks.dev);
gulp.task('build', tasks.build);
gulp.task('deploy', tasks.deploy);

// define default alias (use from ENV)
gulp.task('default', tasks['dev']);
