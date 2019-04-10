const gulp = require('gulp');
const colors = require('ansi-colors');
const asciify = require('asciify');

// load config
const config = require('../config');

const task = (done) => {

    if (config.env.mode === 'production') {

        console.log(colors.white('\n  Production'));

        // bring out some ASCII art
        asciify('MASTER BUILDER', {
            font: 'big',
            color: 'red'
        }, (err, res) => {
            console.log(res);
            done();
        });
    }
    else {

        console.log(colors.white('\n  Development'));

        // bring out some ASCII art
        asciify('MASTER BUILDER', {
            font: 'mini',
            color: 'blue'
        }, (err, res) => {
            console.log(res);
            done();
        });
    }
};

gulp.task('init', task);
module.exports = task;
