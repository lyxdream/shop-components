const merge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const baseWebpackConfig = require('./webpack.config.base');
const RemoveDuplicateRootHostPlugin = require('./removeDuplicateRootHostPlugin');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    taro: {
      root: 'Taro',
      commonjs: 'taro',
      commonjs2: 'taro',
      amd: 'taro'
    }
  },
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath: '/',
    filename: 'cq-shop-components.js',
    library: 'cq-shop-components',
    libraryTarget: 'umd'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/wm-shop-components.css',
      chunkFilename: 'style/wm-shop-components.css'
    }),
    new RemoveDuplicateRootHostPlugin()
  ]
});