var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var del = require('del');
var rename = require("gulp-rename");

gulp.task('clean', function(){
   return del.sync([
    'prod/**/*'
  ]);
});

gulp.task('index', function(){
   return gulp.src('src/index-aot.html')
   .pipe(rename('index.html'))
   .pipe(gulp.dest('prod/'));
});

gulp.task('js', function(){
   return gulp.src('src/js/*.js')
   .pipe(concat('script.js'))
   .pipe(uglify())
   .pipe(gulp.dest('prod/js/'));
});

gulp.task('css', function(){
   return gulp.src('src/css/*.css')
   .pipe(concat('custom.css'))
   .pipe(minify())
   .pipe(gulp.dest('prod/css/'));
});

gulp.task('production-build', function(){
   return gulp.src(['aot/*.js','aot/*.css','aot/dist/*','aot/favicon.ico'],{base: './aot/'})
   .pipe(gulp.dest('prod/'));
});

gulp.task('default',['clean','index','js','css','production-build'],function(){
});