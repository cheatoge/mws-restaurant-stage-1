const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-minify');


/* Watch for changes */
gulp.task('serve', function () {

  browserSync.init({
    server: "./dist"
  });

  gulp.watch('./css', ['styles']);
  gulp.watch('./*.html', ['copy-html']);
  gulp.watch('./dist/*.html').on('change', browserSync.reload);
  gulp.watch('./js/*.js', ['scripts']);
  gulp.watch('./sw.js', ['scripts']);
  gulp.watch('./dist/js/*.js').on('change', browserSync.reload);
});

/* Compile sass into CSS & auto-prefix & auto-inject into browsers */
gulp.task('styles', function () {
  return gulp.src('./css/*.css')
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts-dist', function () {
  gulp.src('./js/*')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
  gulp.src('./sw.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('scripts', function () {
  gulp.src('./js/*')
    .pipe(gulp.dest('./dist/js'));
  gulp.src('./sw.js')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-html', function () {
  gulp.src('./*.html')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-manifest', function () {
  gulp.src('./manifest.json')
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-img', function () {
  gulp.src('./img/**/*.{gif,jpg,png,svg}')
    .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', ['styles', 'copy-html','copy-manifest', 'scripts', 'serve']);

gulp.task('dist', ['copy-img', 'copy-html','copy-manifest', 'scripts-dist', 'styles', 'serve']);