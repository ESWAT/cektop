var gulp          = require('gulp'),
    atImport      = require('postcss-import'),
    autoprefixer  = require('autoprefixer'),
    babel         = require('gulp-babel'),
    colorFunction = require('postcss-color-function'),
    concat        = require('gulp-concat'),
    connect       = require('gulp-connect'),
    ghPages       = require('gulp-gh-pages'),
    imagemin      = require('gulp-imagemin'),
    lost          = require('lost'),
    nested        = require('postcss-nested'),
    mixins        = require('postcss-mixins'),
    pug           = require('gulp-pug'),
    plumber       = require('gulp-plumber'),
    postcss       = require('gulp-postcss'),
    rename        = require('gulp-rename'),
    rimraf        = require('rimraf'),
    runSequence   = require('run-sequence'),
    simplevars    = require('postcss-simple-vars'),
    sourcemaps    = require('gulp-sourcemaps'),
    uglify        = require('gulp-uglify');

var paths = {
    assets  : 'src/assets/**/*',
    cname   : 'src/CNAME',
    images  : 'src/images/**/*.{png,jpg,gif,svg}',
    pug     : 'src/**/*.pug',
    lib     : 'src/lib/**/*.js',
    js      : 'src/js/**/*.js',
    css     : 'src/css/**/*.css',
    release : 'release/'
};

gulp.task('clean', cb => {
  rimraf(paths.release, cb);
});

gulp.task('watch', () => {
  gulp.watch(paths.js, ['js:dev']);
  gulp.watch(paths.pug, ['pug:dev']);
  gulp.watch(paths.css, ['css:dev']);
  gulp.watch(paths.images, ['imagemin:dev']);
  gulp.watch(paths.assets, ['assets']);
});

gulp.task('deploy', () => {
  gulp.src('./release/**/*')
    .pipe(ghPages());
});

gulp.task('assets',() => {
  return gulp.src(paths.assets)
    .pipe(plumber())
    .pipe(gulp.dest(paths.release + 'assets/'));
});

gulp.task('cname',() => {
  return gulp.src(paths.cname)
    .pipe(gulp.dest(paths.release));
});

gulp.task('connect:dev',() => {
  connect.server({
    root: paths.release,
    port: 8000,
    livereload: true
  });
});

gulp.task('connect:rel',() => {
  connect.server({
    root: paths.release,
    port: 8000
  });
});

gulp.task('css:dev',() => {
  return gulp.src([paths.css, '!**/_*.css'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(postcss([
      atImport,
      mixins,
      simplevars,
      nested,
      lost,
      colorFunction,
      autoprefixer
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.release + 'css/'))
    .pipe(connect.reload());
});

gulp.task('css:rel',() => {
  return gulp.src([paths.css, '!**/_*.css'])
    .pipe(postcss([
      atImport,
      mixins,
      simplevars,
      nested,
      lost,
      colorFunction,
      autoprefixer
    ]))
    .pipe(gulp.dest(paths.release + 'css/'))
});

gulp.task('imagemin:dev',() => {
  return gulp.src(paths.images)
    .pipe(plumber())
    .pipe(gulp.dest(paths.release + 'images/'))
});

gulp.task('imagemin:rel',() => {
  return gulp.src(paths.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.release + 'images/'))
});

gulp.task('js:dev',() => {
  return gulp.src([paths.js, '!**/_*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.release + 'js/'))
    .pipe(connect.reload());
});

gulp.task('js:rel',() => {
  return gulp.src([paths.js, '!**/_*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.release + 'js/'))
});

gulp.task('lib:dev',() => {
  return gulp.src([paths.lib, '!**/_*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('lib.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.release + 'js/'))
});

gulp.task('lib:rel',() => {
  return gulp.src([paths.lib, '!**/_*.js'])
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.release + 'js/'))
});

gulp.task('pug:dev',() => {
  return gulp.src([paths.pug, '!**/_*.pug'])
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(rename((path) => {
      if (path.basename=='index') return;
      path.dirname = path.basename;
      path.basename = 'index';
      path.extname = '.html';
    }))
    .pipe(gulp.dest(paths.release))
    .pipe(connect.reload());
});

gulp.task('pug:rel',() => {
  return gulp.src([paths.pug, '!**/_*.pug'])
    .pipe(pug())
    .pipe(rename((path) => {
      if (path.basename=='index') return;
      path.dirname = path.basename;
      path.basename = 'index';
      path.extname = '.html';
    }))
    .pipe(gulp.dest(paths.release))
});

// Start server in development mode
gulp.task('default', ['clean'], cb => {
  runSequence([
      'pug:dev',
      'css:dev',
      'js:dev',
      'lib:dev',
      'assets',
      'imagemin:dev',
    ], [
      'connect:dev',
      'watch'
    ]
  , cb);
});

// Start server in preview mode
gulp.task('preview', ['clean'], cb => {
  runSequence([
      'pug:rel',
      'css:rel',
      'js:rel',
      'lib:rel',
      'assets',
      'imagemin:rel',
    ],
    'connect:rel'
  , cb);
});

// Build optimized files
gulp.task('build', cb => {
  runSequence('clean', [
    'pug:rel',
    'css:rel',
    'js:rel',
    'lib:rel',
    'assets',
    'cname',
    'imagemin:rel'
  ], cb)
});

// Deploy to GitHub Pages
gulp.task('shipit', cb => {
  runSequence('build', 'deploy', cb);
});
