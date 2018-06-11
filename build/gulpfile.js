const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const typescript = require('gulp-typescript');
const browserSync = require('browser-sync');

//------------------------------------
const SRC_DIR = '../src';
const DST_DIR = '../lib';
const TEST_DIR = '../test'

const SRC_FILENAME= 'reference';
const DST_FILENAME= 'umadash';
//------------------------------------

function getTypescriptOptions(output, declaration) {
    return {
        out: output,
        declaration: declaration,
        removeComments: true,
        target: 'ES5',
        lib: ['es6', 'dom']
    };
}

gulp.task('compile', () => {
    gulp.src([SRC_DIR + '/' + SRC_FILENAME + '.ts'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(typescript(getTypescriptOptions(DST_FILENAME + '.js', true)))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DST_DIR))
});

gulp.task('compile-min', () => {
    gulp.src([SRC_DIR + '/' + SRC_FILENAME + '.ts'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(typescript(getTypescriptOptions(DST_FILENAME + '.min.js', false)))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DST_DIR))
});

gulp.task('compile-test', () => {
    gulp.src([TEST_DIR + '/**/*.ts'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(typescript(getTypescriptOptions(DST_DIR + DST_FILENAME + '.js', false)))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(TEST_DIR))
});

gulp.task('watch', () => {
    gulp.watch([SRC_DIR + '/**/*.ts'], ['compile', 'compile-min', browserSync.reload]);
    gulp.watch([TEST_DIR + '/**/*.ts'], ['compile-test', browserSync.reload]);
    gulp.watch([TEST_DIR + '/**/*.html'], browserSync.reload);
});

gulp.task('browser-sync', () => {
    browserSync({
      server: {
        baseDir: '../'
      },
      startPath: '/test/test.html'
    });
});

gulp.task('serve', ['browser-sync']);
// gulp.task('default', ['watch', 'serve', 'compile', 'compile-min', 'compile-test']);
gulp.task('default', ['watch', 'serve', 'compile']);