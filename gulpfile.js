var gulp = require('gulp'); // Gulp is always required
var scss = require('gulp-sass')(require('sass')); // Gulp libsass implementation
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssnano');
var rename = require('gulp-rename');
var notify = require("gulp-notify");
var plumber = require("gulp-plumber");
var htmlreplace = require("gulp-html-replace");


const terser = require('gulp-terser');

const path = require('path');

var onError = function (err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Basso"
    })(err);
    this.emit('end');
};

/**
 * Compiles SCSS files into CSS
 *
 * @source .scss files
 * @dest .css and .min.css files
 */
const PATH_CSS_SRC = './assets/sass/*.scss';
const PATH_CSS_DEST = './assets/css';
gulp.task('scss', function () {
    return gulp.src(PATH_CSS_SRC)

        .pipe(plumber({ errorHandler: onError }))

        .pipe(sourcemaps.init())
        .pipe(scss({}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATH_CSS_DEST))

        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(PATH_CSS_DEST))
        
        .pipe(notify({
            title: "Gulp",
            message: "Sass Compiled!",
            onLast: true
        }));
});

/**
 * Minify JS files
 *
 * @source .js files
 * @dest .min.js files
 */
const PATH_JS_SRC = './assets/js/!(*.min)*.js';
const PATH_JS_DEST = './assets/js';
gulp.task('js', function () {
    return gulp.src(PATH_JS_SRC)

        .pipe(plumber({ errorHandler: onError }))

        .pipe(terser())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(PATH_JS_DEST))
        
        .pipe(notify({
            title: "Gulp",
            message: "JS Minified!",
            onLast: true
        }));
});

// Watch and build commands
gulp.task('scss:watch', function () {
    gulp.watch(PATH_CSS_SRC, gulp.series('scss'));
});
gulp.task('js:watch', function () {
    gulp.watch(PATH_JS_SRC, gulp.series('js'));
});

gulp.task('watch', function () {
    //watch for changes
    gulp.watch(PATH_CSS_SRC, gulp.series('scss'));
    gulp.watch(PATH_JS_SRC, gulp.series('js'));
});

gulp.task('build', gulp.series('scss','js'));