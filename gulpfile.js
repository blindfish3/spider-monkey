// - - - - - DEPENDENCIES - - - - - //
var gulp    = require('gulp');
var changed = require('gulp-changed');//TODO: test this requirement
var gutil   = require('gulp-util');
var notify  = require('gulp-notify');
var jade    = require('gulp-jade');
var sass    = require('gulp-sass');
var sourcemaps = require("gulp-sourcemaps");
var source  = require('vinyl-source-stream');
var jshint  = require('gulp-jshint');
var browserify = require('browserify');
var rename  = require('gulp-rename');
var glob    = require('glob');
var es      = require('event-stream');
var del     = require('del');
var browserSync = require('browser-sync').create();

// - - - - - VARIABLES - - - - - //
var reload  = browserSync.reload;
var SRC = './src';
var DEST = './dist';

// - - - - - HELPERS - - - - - //
//SOURCE: mlouro/gulpfile.js - https://gist.github.com/mlouro/8886076
var handleError = function(task) {
  return function(err) {

      notify.onError({
        message: task + ' failed, check the logs..'
      })(err);

    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
  };
};


// - - - - - TASKS - - - - - //
gulp.task('clean', function(callback) {
    del([DEST + '/**']).then(function() {
        callback();
    });
});



// Perform a direct copy of all assets;
// excluding anything to be handled by other tasks...
gulp.task('assets', function() {
  return gulp.src([SRC + '/**/*',
                    '!' + SRC + '/**/_lib',
                    '!' + SRC + '/**/*.js',
                    '!' + SRC + '/**/*.scss',
                    '!' + SRC + '/**/_templates',
                    '!' + SRC + '/**/*.jade'])
  .pipe(changed(DEST))
  .pipe(gulp.dest(DEST))
  .pipe(browserSync.stream());
});



gulp.task('lint', function() {
    return gulp.src([SRC + '/**/*.js',
                    //exclude JS files handled by browserify
                    '!' + SRC + '/**/_lib',
                    '!' + SRC + '/**/bify_**.js',
                    '!' + SRC + '/**/_*.js'])
        .pipe(changed(DEST))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(DEST))
        .pipe(browserSync.stream());
})



gulp.task('browserify', function() {

    //TODO: add sourcemaps
    // see: http://sethlakowske.com/articles/gulp-browserify-source-maps/

    //SOURCE: Gulp: Creating multiple bundles with Browserify
    //        http://fettblog.eu/gulp-browserify-multiple-bundles/#using-globs
    glob(SRC + '/**/main_**.js', function(err, files) {
            if(err) done(err);

            var tasks = files.map(function(entry) {
                return browserify({ entries: [entry] })
                    .bundle()
                    .on('error', handleError('browserify'))
                    .pipe(source(entry))
                    .pipe(rename(function(path) {
                        // TODO: replacing pathname like this seems crude - particularly
                        // since it doesn't use the SRC variable
                        path.dirname = path.dirname.replace('src/', '');
                        path.basename = path.basename.replace('main_', '');
                    }))
                    .pipe(gulp.dest('./dist'))
                    .pipe(browserSync.stream());
                });
            //TODO: figure out what this does :/
            // es.merge(tasks).on('end', done);
        })


});



// using templates will make it easier to ensure consistency
// and for example to globally update paths to dependencies hosted on CDN servers
// ...but you can author in plain old HTML if you so wish: the assets task will
// shunt html pages across to dist
gulp.task('templates', function() {
    //TODO: avoid processing pages that haven't changed
    return gulp.src(['./src/**/*.jade', '!./src/_templates/**' ])
        .pipe(changed(DEST))
        .pipe(jade({pretty: true}))
        //TODO: fix this: reports errors, but doesn't allow watch task to continue
        .on('error', handleError('jade'))
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
gulp.task('serve',
         ['assets', 'templates', 'sass', 'lint', 'browserify'],
         function() {

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
          gulp.watch(SRC + "/**/*.js", ['lint', 'browserify']);

});



gulp.task('default', ['serve']);
