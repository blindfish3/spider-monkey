var gulp = require('gulp');
var changed = require('gulp-changed');//TODO: test this requirement

var jade = require('gulp-jade');

var sass = require('gulp-sass');
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');

var jshint = require('gulp-jshint');

var del = require('del');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


var SRC = './src';
var DEST = './dist';

gulp.task('clean', function() {
    del([DEST + '/**']);
    //.then(paths => {	console.log('Deleted files and folders:\n', paths.join('\n'));  });
});

// Perform a direct copy of all assets;
// excluding anything to be handled by other tasks...
gulp.task('assets', function() {
  return gulp.src([SRC + '/**/*',
                    '!' + SRC + '/**/*.js',
                    '!' + SRC + '/**/*.scss',
                    '!' + SRC + '/**/*.jade'])
  .pipe(changed(DEST))
  .pipe(gulp.dest(DEST))
  .pipe(browserSync.stream());
});


gulp.task('lint', function() {
    return gulp.src([SRC + '/**/*.js'])
        .pipe(changed(DEST))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(DEST))
        .pipe(browserSync.stream());
})

// using templates will be easier to ensure consistency
// and for example to globally update paths to dependencies on CDN servers
// ...but you can author in plain old HTML if you so wish: the assets task will
// shunt html pages across to dist
gulp.task('templates', function() {
    //TODO: avoid processing pages that haven't changed
    return gulp.src(['./src/**/*.jade', '!./src/_templates/**' ])
        .pipe(changed(DEST))
        .pipe(jade({pretty: true}))
        //TODO: catch errors here!!!
        .pipe(gulp.dest(DEST))
        //TODO: is this proper usage?
        .pipe(browserSync.stream());
});

gulp.task('jade-watch', ['templates'], reload);

// As with HTML you could choose to author CSS directly; but SASS rocks :)
gulp.task('sass', function() {
  return gulp.src(SRC + '/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(changed(DEST))
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream());
});


// before serving content ensure it's all been built by running all tasks as devDependencies
//TODO: run clean first
gulp.task('serve', ['assets', 'templates', 'sass', 'lint'], function() {

  browserSync.init({
    server: {
      baseDir: DEST,
      directory: true // displays navigable directory structure
    },
    ghostmode: {
      clicks: true,
      forms: true,
      scroll: true
    }

  });

  gulp.watch(SRC + "/**/*.html", ['assets']);
  gulp.watch(SRC + "/**/*.css", ['assets']);
  gulp.watch(SRC + "/**/*.jade",  ['jade-watch']);
  gulp.watch(SRC + "/**/*.scss", ['sass']);
  gulp.watch(SRC + "/**/*.js", ['lint']);

});


gulp.task('default', ['serve']);
