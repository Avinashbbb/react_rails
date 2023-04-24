const path = require('path');
const StatsPlugin = require('stats-webpack-plugin');
const webpack = require('webpack');

const context = path.resolve(__dirname, '..');

module.exports = {
  context,
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'intl',
    './client',
  ],
  output: {
    path: path.resolve(context, '..', 'public'),
    filename: 'js/[name]-[hash].js',
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
    noParse: [/moment.js/],
  },
  plugins: [
    new StatsPlugin('../client/dist/stats.json', { chunkModules: true }),
    new webpack.DefinePlugin({
      API_URL: '"/optigo/api/v1"',
      BROWSER: true,
      TARGET: '"WEB"',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
  ],
  externals: {
    '@material-ui/core': 'window["material-ui"]',
    'intl': 'Intl',
    'lodash': '_',
    'material-ui-pickers': 'window["material-ui-pickers"]',
    'moment': 'moment',
    'prop-types': 'PropTypes',
    'react': 'React',
    'react-beautiful-dnd': 'ReactBeautifulDnd',
    'react-dom': 'ReactDOM',
    'react-redux': 'ReactRedux',
    'react-router-dom': 'ReactRouterDOM',
    'redux': 'Redux',
    'redux-thunk': 'ReduxThunk',
    'styled-components': 'styled',
  }
};
