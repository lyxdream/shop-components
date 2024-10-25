const merge = require('webpack-merge')
const path = require('path')

const baseWebpackConfig = require('./webpack.config.base')

const componentsEntries = {
  "cq-button":  path.resolve(__dirname, '../packages/components/base/button/index.ts'),
}

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  entry: componentsEntries,
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[id].js',
    libraryTarget: 'commonjs2'
  },
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
  }
})
