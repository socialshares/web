'use strict'

const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const InjectWebpackPlugin = require('inject-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const cssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')
const postcssEach = require('postcss-each')

const __DEV__ = process.env.NODE_ENV !== 'production'
const __PROD__ = process.env.NODE_ENV === 'production'

var config = {
  entry: {
    'index': ['./src/js/index.js'],
    'share': ['./src/js/share.js'],
  },
  output: {
    path: './dist',
    filename: '[name].js',
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.ejs',
      filename: 'index.html',
      inject: false,
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
      },
    }),
    new HtmlPlugin({
      template: './src/share.ejs',
      filename: 'share.html',
      inject: false,
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
      },
    }),
    new CopyPlugin([
      {from: './src/static', to: './'},
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(__DEV__ ? 'development' : 'production'),
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: [/.ejs$/],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite?'+JSON.stringify({
          name: 'icon-[name]',
          prefixize: true,
        }),
      },
      {
        test: /\.ejs$/,
        loader: 'ejs',
      },
    ],
  },
  postcss: webpack => {
    return [
      postcssImport({ addDependencyTo: webpack }),
      postcssEach,
      cssnext,
    ]
  },
}

if (__DEV__) {
  config.plugins.push(
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost:3100/',
      },
      {
        reload: false,
      }
    )
  )
  config.module.loaders.push({
    test: /\.css$/,
    loaders: ['style', 'css', 'postcss'],
  })
  config.devtool = 'source-map'
}

if (__PROD__) {
  config.plugins.push(
    new ExtractTextPlugin('[name].css', {allChunks: false})
  )
  config.plugins.push(
    new InjectWebpackPlugin({
      './src/index.ejs': './src/blank.html',
      './src/share.ejs': './src/blank.html',
    })
  )
  config.module.loaders.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
  })
}

module.exports = config
