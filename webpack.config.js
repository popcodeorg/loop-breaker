/* eslint-env node */

const libraryName = 'loopBreaker';
const outputFile = `${libraryName}.js`;

const config = {
  entry: `${__dirname}/src/index.js`,

  devtool: 'source-map',

  output: {
    path: `${__dirname}/dist`,
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },

  resolve: {
    extensions: ['.js'],
  }
};

module.exports = config;
