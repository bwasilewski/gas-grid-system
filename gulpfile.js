const gulp          = require('gulp')
const nunjucks      = require('gulp-nunjucks-render')
const sass          = require('gulp-sass')
const sourcemaps    = require('gulp-sourcemaps')
const browsersync   = require('browser-sync')
const jshint        = require('gulp-jshint')
const concat        = require('gulp-concat')
const rename        = require('gulp-rename')
const uglify        = require('gulp-uglify-es').default
const del           = require('del')
const plumber       = require('gulp-plumber')
const autoprefixer  = require('gulp-autoprefixer')
const clean         = require('gulp-clean-css')
const jsplugins     = 'src/js/vendors/**/*.js'
const siteconfig    = {
  title: 'Gimme A Site - Websites for your business',
  contact: 'benwasilewski@gmail.com'
}

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('sass', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(rename({suffix: '.min'}))
    .pipe(clean({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.reload({stream:true, match: '**/*.css'}));
})

gulp.task('templates', () => {
  return gulp.src('src/*.html')
    .pipe(nunjucks({
      path: ['src/templates/'],
      data: siteconfig
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browsersync.reload({stream:true}));
})

gulp.task('js-plugins', () => {
  return gulp.src(jsplugins)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('dist/js'))
})

gulp.task('js-main', () => {
  return gulp.src('src/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest('./dist/js'))
})

gulp.task('compress', (cb) => {
  gulp.src('dist/js/main.js')
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

gulp.task('browser-sync', () => {
  browsersync.init(null, {
    server: {
      baseDir: 'dist'
    }
  })
})

gulp.task('bs-reload', () => {
  browsersync.reload()
})

gulp.task('default', ['sass', 'templates', 'js-plugins', 'js-main', 'browser-sync'], () => {
  // will need to convert this to gulp-watch eventually
  // or projects may become too slow to generate
  gulp.watch('src/scss/**/*.scss', ['sass'])
  gulp.watch('src/*.html', ['templates'])
  gulp.watch('src/templates/**/*.html', ['templates'])
  gulp.watch('src/js/**/*.js', ['js-plugins', 'js-main', 'compress'])
})
