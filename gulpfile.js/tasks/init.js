const gulp = require('gulp');
const colors = require('ansi-colors');
const asciify = require('asciify');

// load config
const config = require('../config');

const task = (done) => {

    let mode = config.env.mode === 'production' ? 'Production' : 'Development';
    let color = config.env.mode === 'production' ? 'red' : 'blue';
    let version = 'v' + config.pkg.version;

    console.log(colors.white('\n ' + mode + version.padStart(51, ' ')));

    // bring out some ASCII art
    asciify('MASTER BUILDER', {
        font: 'cybermedium',
        color: color,
    }, (err, res) => {
        console.log(res);
        done();
    });
};

gulp.task('init', task);
module.exports = task;
