const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack');
const del = require('del');
const pify = require('pify');
const webpackConfig = require('./webpack.config.js');

gulp.task('default', ['compile', 'build']);

gulp.task('compile', ['clean'], () =>
  gulp.src('src/*.js').
    pipe(babel()).
    pipe(gulp.dest('lib'))
);

gulp.task('build', ['clean'], () =>
  pify(webpack)(webpackConfig)
);

gulp.task('clean', () => {
  return del([
    'dist/**',
    'lib/**',
  ]);
});
