require('es6-promise').polyfill();
var path = require('path');
var join = path.join;

var dir = path.resolve(__dirname);

var config = {

  cache: true,
  devtool: 'eval',
  entry: 'test/test.js',

  output: {
    filename: 'bundle.js',
    path: 'test/',
    publicPath: '/assets/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: [
          join(dir, 'index.js'),
          join(dir, 'test/')
        ],
        query: {
          presets: ['es2015']
        }
      }
    ]
  },

  resolve: {
    root: dir,
    extensions: ['', '.js'],
    alias: {
      'sentry': dir
    }
  }

};

module.exports = config;
