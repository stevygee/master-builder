const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const copy = require('cpy');
const path = require('path');

// load config
const config = require('../config');

let tasks = [];
// loop through copy tasks (see config) and fill an array with results from copy functions (promises!)
for (let v of config.copyDist) {
    const copyTask = () => copy(v.sourceFiles, path.resolve(v.destinationFolder), {
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

const task = gulp.series(tasks);

gulp.task('copyDist', task);
module.exports = task;
