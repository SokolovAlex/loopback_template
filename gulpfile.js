const gulp = require("gulp"),
    nodemon = require('gulp-nodemon');

gulp.task('default', ['start']);

gulp.task('start', function () {
    nodemon({
        script: '.'
        , ext: 'js'
        , env: { 'NODE_ENV': 'development' }
    })
});