const del = require('del');
const path = require('path');
const gulp = require('gulp');
const runSequence = require('run-sequence');
const plugins = require('gulp-load-plugins')({
  lazy: true
});
const browserSync = require('browser-sync').create();

const config = {
  appName: 'fmsc'
};

gulp.task('build:clean', () => {
  return del(['www/**/*', '!www/.gitkeep']);
});

gulp.task('build:fonts', () => {
  return gulp.src('app/assets/fonts/**/*.*')
    .pipe(plugins.plumber())
    .pipe(gulp.dest('www/assets/fonts/'))
    .pipe(browserSync.stream());
});

gulp.task('build:images', () => {
  return gulp.src('**/*.*', {
      cwd: 'app/assets/images/'
    })
    .pipe(plugins.plumber())
    .pipe(gulp.dest('www/assets/images/'))
    .pipe(browserSync.stream());
});

gulp.task('build:templates', () => {
  return gulp.src('**/*.html', {
      cwd: 'app/components/'
    })
    .pipe(plugins.plumber())
    .pipe(plugins.angularTemplatecache('templates.js', {
      module: config.appName
    }))
    .pipe(gulp.dest('www/app/'))
    .pipe(browserSync.stream());
});

gulp.task('build:vendor', () => {
  var vendorFiles = require('./vendor.json');

  return gulp.src(vendorFiles)
    .pipe(plugins.plumber())
    .pipe(gulp.dest('www/vendor/'))
    .pipe(browserSync.stream());
});

gulp.task('build:lint', () => {
  return gulp.src('**/*.js', { cwd: 'app/' })
    .pipe(plugins.plumber())
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format());
});

gulp.task('build:js', () => {
  return gulp.src([
      'app.module.js',
      'app.config.js',
      '**/*.module.js',
      '**/*.config.js',
      '**/*.js',
      '!**/*.spec.js'
    ], {
      cwd: 'app/'
    })
    .pipe(plugins.plumber())
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(plugins.ngAnnotate())
    .pipe(gulp.dest('www/app'))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('build:js:server', () => {
  return gulp.src([
      '**/*.js',
      '!**/*.spec.js'
    ], {
      cwd: 'server/'
    })
    .pipe(plugins.plumber())
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:scss', () => {
  return gulp.src('app/assets/scss/main.scss')
    .pipe(plugins.inject(gulp.src('app/components/**/*.scss'), {
      read: false,
      starttag: '//- inject:{{ext}}',
      endtag: '//- endinject',
      transform: filepath => '@import "' + filepath + '";',
      addRootSlash: false
    }))
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.plumber({
      inherit: true
    }))
    .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))
    .pipe(plugins.concat(config.appName + '.css'))
    .pipe(gulp.dest(path.join('www/assets/css/')))
    .pipe(browserSync.stream());
});

gulp.task('build:inject', () => {

  // build has a '-versionnumber' suffix
  var cssNaming = 'assets/css/*.css';

  // injects 'src' into index.html at position 'tag'
  var _inject = (src, tag) => {
    return plugins.inject(src, {
      starttag: '<!-- inject:' + tag + ':{{ext}} -->',
      read: false,
      addRootSlash: false
    });
  };

  var vendorFiles = require('./vendor.json');

  var vendorsBasename = vendorFiles.map(vendor => 'vendor/' + path.basename(vendor));

  const jsFiles = [
    'app.module.js',
    'app.config.js',
    '**/*.module.js',
    '**/*.config.js',
    '**/*.constants.js',
    '**/*.service.js',
    '**/*.factory.js',
    '**/*.*.js',
    '*.js'
  ];

  var scriptFiles = jsFiles.map(file => 'app/' + file);

  var scriptStream = gulp.src(scriptFiles, {
    cwd: 'www'
  });

  return gulp.src('app/index.html')
    .pipe(plugins.plumber())
    // inject css
    .pipe(_inject(gulp.src(cssNaming, {
      cwd: 'www/'
    }), 'app'))
    // inject vendors
    .pipe(_inject(gulp.src(vendorsBasename, {
      cwd: 'www/'
    }), 'vendor'))
    // inject app.js
    .pipe(_inject(scriptStream, 'app'))
    .pipe(gulp.dest('www/'))
    .pipe(browserSync.stream());
});

gulp.task('debug', ['build'], () => {
  // SCSS
  gulp.watch('**/*.scss', { cwd: 'app' }, ['build:scss']);

  // Fonts
  gulp.watch('assets/fonts/**', { cwd: 'app' }, ['build:fonts']);

  // Images
  gulp.watch('assets/images/**', { cwd: 'app' }, ['build:images']);

  // Javascript Web
  gulp.watch('**/*.js', { cwd: 'app' }, ['build:js', 'build:lint']);

  // Javascript Server
  gulp.watch('**/*.js', { cwd: 'server' }, ['build:js:server', 'build:lint']);

  // Vendors
  gulp.watch('./vendor.json', ['build:vendor']);

  // Templates
  gulp.watch(['**/*.html', '!index.html'], { cwd: 'app' }, ['build:templates']);

  // index.html
  gulp.watch('app/index.html', ['build:inject']);
});

gulp.task('serve', ['debug'], () => {
  browserSync.init({
    server: './www'
  });
});

gulp.task('build', (done) => {
  runSequence(
    'build:clean',
    'build:fonts',
    'build:images',
    'build:templates',
    'build:vendor',
    'build:lint',
    'build:js',
    'build:js:server',
    'build:scss',
    'build:inject',
    done);
});

gulp.task('deploy', () => {
  return gulp.src('./www/**/*')
    .pipe(plugins.ghPages());
});
