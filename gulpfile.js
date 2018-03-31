const gulp          = require('gulp')
const nunjucks      = require('gulp-nunjucks-render')
const sass          = require('gulp-sass')
const sourcemaps    = require('gulp-sourcemaps')
const browsersync   = require('browser-sync')
const siteconfig    = {
  title: 'Gimme A Site - Websites for your business',
  contact: 'benwasilewski@gmail.com'
}

gulp.task('sass', () => {
  console.log('task sass')

  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.reload({stream:true, match: '**/*.css'}));
})

gulp.task('templates', () => {
  gulp.src('src/*.html')
    .pipe(nunjucks({
      path: ['src/templates/'],
      data: siteconfig
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(browsersync.reload({stream:true}));
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

gulp.task('default', ['sass', 'templates', 'browser-sync'], () => {
  // will need to convert this to gulp-watch eventually
  // or projects may become too slow to generate
  gulp.watch('src/scss/**/*.scss', ['sass'])
  gulp.watch('src/*.html', ['templates'])
  gulp.watch('src/templates/**/*.html', ['templates'])
})
