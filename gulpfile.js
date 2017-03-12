const gulp = require('gulp');
const _ = require('lodash');
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

gulp.task('build', ['clean'], () => {
  const minifiedWebpackConfig = _.cloneDeep(webpackConfig);
  minifiedWebpackConfig.output.filename =
    minifiedWebpackConfig.output.filename.replace('.js', '.min.js');
  minifiedWebpackConfig.plugins = [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ];
  return Promise.all([
    pify(webpack)(webpackConfig),
    pify(webpack)(minifiedWebpackConfig),
  ]);
});

gulp.task('clean', () => {
  return del([
    'dist/**',
    'lib/**',
  ]);
});
