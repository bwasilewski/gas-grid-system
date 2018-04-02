const gulp          = require('gulp')
const nunjucks      = require('gulp-nunjucks-render')
const sass          = require('gulp-sass')
const sourcemaps    = require('gulp-sourcemaps')
const browsersync   = require('browser-sync')
const concat        = require('gulp-concat')
const rename        = require('gulp-rename')
const uglify        = require('gulp-uglify-es').default
const del           = require('del')
const plumber       = require('gulp-plumber')
const autoprefixer  = require('gulp-autoprefixer')
const clean         = require('gulp-clean-css')
const sequence      = require('gulp-sequence')
const browserify    = require('browserify')
const babelify      = require('babelify')
const source        = require('vinyl-source-stream')
const buffer        = require('vinyl-buffer')
const jsplugins     = 'src/js/vendors/**/*.js'
const taskconfigs   = {
  site: {
    title: 'Gimme a Site - Websites for your business',
    description: '',
    contact: 'benwasilewski@gmail.com',
    client: 'Gimme a Site.com',
    currentyear: new Date().getFullYear(),
    navigation: [
      {
        label: 'Home',
        path: '/index.html'
      },
      {
        label: 'About',
        path: '/about.html'
      },
      {
        label: 'Contact',
        path: '/contact.html'
      }
    ]
  }
}

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('favicon', () => {
  return gulp.src('src/favicon.ico')
    .pipe(gulp.dest('dist/'))
})

gulp.task('sass', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({suffix: '.min'}))
    .pipe(clean({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('templates', () => {
  return gulp.src('src/*.html')
    .pipe(nunjucks({
      path: ['src/templates/'],
      data: taskconfigs.site
    }))
    .pipe(gulp.dest('./dist/'))
})

gulp.task('scripts', () => {
  var b = browserify({
    entries: ['./src/js/main.js'],
    debug: true
  })

  return b.bundle()
    .pipe(source('scripts.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', (error) => {console.log(error)})
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js/'))
})

gulp.task('browser-sync', () => {
  browsersync.init(null, {
    server: {
      baseDir: 'dist'
    },
    ghostMode: true,
    watchEvents: ['change', 'add', 'unlink', 'addDir', 'unlinkDir']
  })
})

gulp.task('bs-reload', () => {
  browsersync.reload()
})

gulp.task('start-server', sequence('clean', 'favicon', ['sass', 'templates', 'scripts'], 'browser-sync'))

gulp.task('default', ['start-server'], () => {
  // will need to convert this to gulp-watch eventually
  // or projects may become too slow to generate
  gulp.watch('src/scss/**/*.scss', ['sass'])
  gulp.watch('src/*.html', ['templates'])
  gulp.watch('src/templates/**/*.html', ['templates'])
  gulp.watch('src/js/*.js', ['scripts'])
  gulp.watch(['./dist/*.html', './dist/css/*.css', './dist/js/**/*.js'], ['bs-reload'])
})
