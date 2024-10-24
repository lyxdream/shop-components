const path = require('path');
const Webpackbar = require('webpackbar');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;

module.exports = {
  entry: path.resolve(__dirname, '../src/index.ts'), // 主入口文件
  resolve: {
    extensions: ['.js','.ts', '.vue', '.json'], // 添加 .ts 扩展名
    alias: {
      // '@packages': path.resolve(__dirname, '../packages')
    }
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|examples)/,
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|examples)/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|examples)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.ts$/,
        exclude: /(node_modules|examples)/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/] // 确保 .vue 文件也能被 ts-loader 处理
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: false // 如果需要 CSS 模块，可以设置为 true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
        type: 'asset', // 使用 Webpack 5 的 asset 模块
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 10KB 以下的文件使用 Data URL
          }
        },
        generator: {
          filename: 'static/img/[name].[hash:7][ext]' // 输出文件路径
        }
      }
    ]
  },
  plugins: [
    new Webpackbar(),
    new VueLoaderPlugin()
  ]
};



