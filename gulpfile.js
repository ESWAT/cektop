var pkg         = require('./package.json'),
    gulp        = require('gulp'),

    babel       = require('gulp-babel'),
    connect     = require('gulp-connect'),
    cssnext     = require("cssnext"),
    del         = require('del'),
    ghPages     = require('gulp-gh-pages'),
    imagemin    = require('gulp-imagemin'),
    jade        = require('gulp-jade'),
    nested      = require('postcss-nested'),
    plumber     = require('gulp-plumber'),
    postcss     = require('gulp-postcss'),
    runSequence = require('run-sequence'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify');

var paths = {
  assets  : 'src/assets/**/*',
  cname   : 'src/CNAME',
  images  : 'src/images/**/*.{png,jpg,gif}',
  jade    : 'src/**/*.jade',
  scripts : 'src/script/**/*.js',
  css     : 'src/css/**/*.css',
  release : 'release/'
};

var locals = {
  title       : pkg.name,
  author      : pkg.author,
  description : pkg.description,
  version     : pkg.version
}

gulp.task('clean', function(cb) {
  del(paths.release, cb);
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['js:dev']);
  gulp.watch(paths.jade, ['jade:dev']);
  gulp.watch(paths.css, ['css:dev']);
  gulp.watch(paths.images, ['imagemin:dev']);
  gulp.watch(paths.assets, ['assets']);
});

gulp.task('deploy', function() {
  gulp.src('./release/**/*')
    .pipe(ghPages());
});

gulp.task('assets', function() {
  return gulp.src(paths.assets)
    .pipe(plumber())
    .pipe(gulp.dest(paths.release + 'assets/'));
});

gulp.task('cname', function() {
  return gulp.src(paths.cname)
    .pipe(gulp.dest(paths.release));
});

gulp.task('connect:dev', function() {
  connect.server({
    root: paths.release,
    port: 8000,
    livereload: true
  });
});

gulp.task('connect:rel', function() {
  connect.server({
    root: paths.release,
    port: 8000
  });
});

gulp.task('css:dev', function() {
  return gulp.src([paths.css, '!**/_*.css'])
    .pipe(plumber())
      .pipe(sourcemaps.init())
    .pipe(postcss([
      nested,
      cssnext({
        browsers: ['last 1 version']
      })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.release + 'css/'))
    .pipe(connect.reload());
});

gulp.task('css:rel', function() {
  return gulp.src([paths.css, '!**/_*.css'])
  .pipe(postcss([
    nested,
    cssnext({
      browsers: ['last 1 version'],
      compress: true
    })
  ]))
    .pipe(gulp.dest(paths.release + 'css/'))
});

gulp.task('imagemin:dev', function() {
  return gulp.src(paths.images)
    .pipe(plumber())
    .pipe(gulp.dest(paths.release + 'images/'))
});

gulp.task('imagemin:rel', function() {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.release + 'images/'))
});

gulp.task('js:dev', function() {
  return gulp.src([paths.scripts, '!**/_*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.release + 'js/'))
    .pipe(connect.reload());
});

gulp.task('js:rel', function() {
  return gulp.src([paths.scripts, '!**/_*.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.release + 'js/'))
});

gulp.task('jade:dev', function() {
  return gulp.src([paths.jade, '!**/_*.jade'])
    .pipe(plumber())
    .pipe(jade({
      pretty: true,
      locals: locals
    }))
    .pipe(gulp.dest(paths.release))
    .pipe(connect.reload());
});

gulp.task('jade:rel', function() {
  return gulp.src([paths.jade, '!**/_*.jade'])
    .pipe(jade({
      locals: locals
    }))
    .pipe(gulp.dest(paths.release))
});

// Start server in development mode
gulp.task('default', ['clean'], function(cb) {
  runSequence([
      'jade:dev',
      'css:dev',
      'js:dev',
      'assets',
      'imagemin:dev',
    ], [
      'connect:dev',
      'watch'
    ]
  , cb);
});

// Start server in preview mode
gulp.task('preview', ['clean'], function(cb) {
  runSequence([
      'jade:rel',
      'csss:rel',
      'js:rel',
      'assets',
      'imagemin:rel',
    ],
    'connect:rel'
  , cb);
});

// Build optimized files
gulp.task('build', function(cb) {
  runSequence('clean', [
    'jade:rel',
    'css:rel',
    'js:rel',
    'assets',
    'cname',
    'imagemin:rel'
  ], cb)
});

// Deploy to GitHub Pages
gulp.task('shipit', function(cb) {
  runSequence('build', 'deploy', cb);
});
