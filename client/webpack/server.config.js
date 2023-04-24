const path = require('path');
const webpack = require('webpack');

const context = path.resolve(__dirname, '..');

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'intl',
    './server',
  ],
  output: {
    path: path.resolve(context, 'dist'),
    filename: 'server.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-react-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: '"/optigo/api/v1"',
      BROWSER: false,
      TARGET: '"WEB"',
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  externals: {
    fs: 'false',
  },
};
