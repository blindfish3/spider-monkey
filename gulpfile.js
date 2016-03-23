// - - - - - DEPENDENCIES - - - - - //
var gulp = require('gulp');

var gutil = require('gulp-util');
var notify = require('gulp-notify');
var del = require('del');
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var rename = require('gulp-rename');
var es = require('event-stream');
var merge = require('utils-merge');

var jade = require('gulp-jade');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

var jshint = require('gulp-jshint');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');

var browserSync = require('browser-sync').create();

// - - - - - VARIABLES - - - - - //
var reload = browserSync.reload;
var SRC = './src';
var DIST = './dist';
var TEST = './test';

// - - - - - HELPERS - - - - - //
//SOURCE: mlouro/gulpfile.js - https://gist.github.com/mlouro/8886076
// added callback: this appears to stop a piped task from blocking and failing
// even when the error is later fixed...
var handleError = function(taskName, callback) {
    return function(err) {

        notify.onError({
            message: taskName + ' failed, check the logs..'
        })(err);

        gutil.log(gutil.colors.bgRed(taskName + ' error:'), gutil.colors.red(err));

        if(callback) {
            callback();
        }
    };
};



// - - - - - TASKS - - - - - //
gulp.task('clean', function(callback) {
    del([TEST + '/**', DIST + '/**']).then(function() {
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
            '!' + SRC + '/**/*.jade'
        ])
        .pipe(gulp.dest(TEST))
        .pipe(browserSync.stream());
});



gulp.task('lint', function() {
    return gulp.src([SRC + '/**/*.js',
            //exclude JS files handled by browserify
            '!' + SRC + '/**/_lib',
            '!' + SRC + '/**/main_**.js',
            '!' + SRC + '/**/_*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest(TEST))
        .pipe(browserSync.stream());
})

// based on:
// http://fettblog.eu/gulp-browserify-multiple-bundles/
// https://www.madetech.com/blog/making-multiple-browserify-bundles-with-gulp

gulp.task('browserify', function(done) {

    globby([SRC + '/**/main_**.js']).then(function(entries) {

        // in case there is no browserfiable content yet...
        if (entries.length > 0) {
            var tasks = entries.map(function(entry) {

                var filename = entry.substring((entry.indexOf('main_') + 5), (entry.length - 3));

                // NOTE: this currently doesn't allow passing of watchify specific arguments
                return watchify(browserify({
                        entries: entry,
                        debug: true,
                        // for standalone to work you need to feed it
                        // the desired (ideally unique!) global identifier
                        standalone: filename
                    }))
                    .bundle()
                    .on('error', handleError('browserify', done))
                    .pipe(source(entry))
                    .pipe(rename(function(path) {
                        // TODO: replacing pathname like this seems crude - particularly
                        // since it doesn't use the SRC variable
                        path.dirname = path.dirname.replace('src/', '');
                        path.basename = path.basename.replace('main_', '');
                    }))
                    .pipe(buffer())
                    .pipe(sourcemaps.init({
                        loadMaps: true
                    }))
                    // Add gulp plugins to the pipeline here.
                    .pipe(sourcemaps.write('./'))
                    .pipe(gulp.dest(TEST))
                    // .pipe(browserSync.stream());

            });

            es.merge(tasks)
                .on('end', done);
        } else {
            done();
        }



    }).catch(function(err) {
        handleError('browserify');
        done();
    });

});



// Note that any final build process relies on content of /TEST being up-to-date
gulp.task('uglify', ['browserify'], function() {
    return gulp.src(TEST + '/**/*.js')
        .pipe(uglify({
            output: {
                comments: /^!|@preserve|@license|@cc_on/i
            }
        }))
        .pipe(rename(function(path) {
            path.basename = path.basename += '.min';
        }))
        .pipe(gulp.dest(DIST));
});



// using templates will make it easier to ensure consistency
// and for example to globally update paths to dependencies hosted on CDN servers
// ...but you can author in plain old HTML if you so wish: the assets task will
// shunt html pages across to dist
gulp.task('templates', function(done) {
    //TODO: avoid processing pages that haven't changed
    return gulp.src(['./src/**/*.jade', '!./src/_templates/**'])
        .pipe(jade({
            pretty: true,
            basedir: './tests/_templates'
        }))
        //TODO: fix this: reports errors, but doesn't allow jade task to run again
        // possibly because gulp.watch is calling jade-watch...
        .on('error', handleError('jade'))
        .pipe(gulp.dest(TEST))
        .pipe(browserSync.stream());
});


gulp.task('jade-watch', ['templates'], reload);



// As with HTML you could choose to author CSS directly; but SASS rocks :)
gulp.task('sass', function() {

    return gulp.src(SRC + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            // outputStyle: 'compressed',
            //includePaths : ['./_vendor']
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(TEST))
        .pipe(browserSync.stream());

});



gulp.task('minify-css', function() {
    return gulp.src(TEST + '/**/*.css')
        .pipe(cleanCSS({
            compatibility: 'ie9'
        }))
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(DIST));
});



// gulp.task('build', ['uglify', 'minify-css']);



// before serving content ensure it's all been built by running all tasks as devDependencies
//TODO: ideally run clean first
gulp.task('serve', ['assets', 'templates', 'sass', 'lint', 'browserify'],
    function() {

        browserSync.init({
            server: {
                baseDir: TEST,
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
        gulp.watch(SRC + "/**/*.jade", ['jade-watch']);
        gulp.watch(SRC + "/**/*.scss", ['sass']);
        gulp.watch(SRC + "/**/*.js", ['lint']);
        gulp.watch(SRC + "/**/*.js", ['browserify']);

    });


gulp.task('default', ['serve']);
