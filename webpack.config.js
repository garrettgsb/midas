const webpack = require('webpack');
const path = require('path');

const config = {
  mode: 'development',
  entry: './src/index.js',
  devServer: {
    contentBase: path.resolve(__dirname, 'src/public'),
    host: '0.0.0.0',
    proxy: {
      '/api': 'http://localhost:8081'
    }
  },
  module: {
    rules: [

      // https://webpack.js.org/loaders/babel-loader/
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },

      // https://webpack.js.org/loaders/sass-loader/
      {
        test: /\.(c|sa|sc)ss$/,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }]
      },
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      //$: 'jquery',
      _: 'lodash',
    })
  ]
};

module.exports = config;
