const path = require('path');
const Webpackbar = require('webpackbar');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssCustomProperties = require('postcss-custom-properties');
const postcssImport = require("postcss-import")
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: path.resolve(__dirname, '../src/index.ts'), // 主入口文件
  resolve: {
    extensions: ['.js','.ts', '.vue', '.json'], // 添加 .ts 扩展名
    alias: {
      '@packages':path.resolve(__dirname, '../packages'),
      '@src': path.resolve(__dirname, '../src')
    }
  },
  performance: {
    hints: "warning"
  },

  module: {
    rules: [
      {
        test: /\.(js|ts|vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules|examples/,
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules|examples/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules|examples/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|examples/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/] // 确保 .vue 文件也能被 ts-loader 处理
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules|examples/, // 确保排除 examples
        use: [
          MiniCssExtractPlugin.loader,
          // {
          //   loader: 'vue-style-loader'
          // },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: false // 如果需要 CSS 模块，可以设置为 true
            }
          },
          // 'postcss-loader',
          { 
              loader: 'postcss-loader', 
              options: {
              postcssOptions: {
                plugins: [
                  postcssImport({
                    path: [path.resolve(__dirname, '../packages/style/var.scss')] // 这里的路径需要指向你的CSS文件所在目录
                  }),
                  postcssCustomProperties({
                    preserve: false
                  })
                ]
              }

            } 
          },
        //   options: {
        //     postcssOptions: {
        //         plugins: [
        //             //简写形式
        //             'postcss-preset-env'
        //             // require('autoprefixer'),
        //             // require('postcss-preset-env')
        //         ]
        //     }
        // }
          'sass-loader',
          // {
          //   loader: 'sass-resources-loader',
          //   options: {
          //     resources:  path.resolve(__dirname, '../packages/style/index.scss') ,
          //   },
          // }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
        exclude: /node_modules|examples/, // 确保排除 examples
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



