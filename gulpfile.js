const gulp = require("gulp"),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    nodemon = require('gulp-nodemon');

gulp.task('default', ['start']);

gulp.task('start', function () {
    nodemon({
        script: '.'
        , ext: 'js'
        , env: { 'NODE_ENV': 'development' }
    })
});

gulp.task('tests_build', function () {
    gulp.src([
        './node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js',
        './node_modules/jasmine-core/lib/jasmine-core/jasmine.css',
        './node_modules/jasmine/bin/jasmine.js'
    ]).pipe(gulp.dest('client/build/'));

    return browserify('./tests/index.js')
        .bundle()
        .pipe(source('tests.js'))
        .pipe(gulp.dest('client/build/'))
});

gulp.task('tests', ['tests_build', 'start']);