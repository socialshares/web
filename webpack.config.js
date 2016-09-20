'use strict'

const webpack = require('webpack')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const InjectWebpackPlugin = require('inject-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const cssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')

const __DEV__ = process.env.NODE_ENV !== 'production'
const __PROD__ = process.env.NODE_ENV === 'production'

var config = {
  entry: {
    'index': ['./src/js/index.js'],
  },
  output: {
    path: './dist',
    filename: '[name].js',
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'head',
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
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite?'+JSON.stringify({
          name: 'icon-[name]',
          prefixize: true,
        }),
      },
      {
        test: /\.html$/,
        loader: 'raw',
      },
    ],
  },
  postcss: webpack => {
    return [
      postcssImport({ addDependencyTo: webpack }),
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
      './src/index.html': './src/blank.html',
    })
  )
  config.module.loaders.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader'),
  })
}

module.exports = config
