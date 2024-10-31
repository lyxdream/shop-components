const merge = require('webpack-merge')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const baseWebpackConfig = require('./webpack.config.base')

const componentsEntries = {
  "cq-button":  path.resolve(__dirname, '../packages/components/base/button/index.ts'),
  "cq-checkbox":  path.resolve(__dirname, '../packages/components/base/checkbox/index.ts'),
}

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  entry: componentsEntries,
  output: {
    path: path.resolve(process.cwd(), './dist'),
    publicPath: '/',
    filename: 'lib/[name].js',
    chunkFilename: 'lib/[id].js',
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
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/components/[name].css', // 每个入口点生成一个单独的 CSS 文件
      chunkFilename: 'style/components/[id].css', // 对于按需加载的 chunk 生成的 CSS 文件名
    })
  ],
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: 'style/index', // 将多个入口文件中的样式文件全部合并打包到一个名为'style'的chunk中
  //         type: "css/mini-extract",
  //         chunks: 'all', // 应用于所有chunks，包括同步和异步加载的
  //         enforce: true, // 强制执行这个缓存组规则
  //       },
  //     },
  //   },
  // }
})
