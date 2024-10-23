const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.config.base');

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
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/',
    filename: 'cq-shop-components.js',
    library: 'cq-shop-components',
    libraryTarget: 'umd',
    globalObject: 'this' // 确保 UMD 构建在不同环境中都能正确运行
  }
});