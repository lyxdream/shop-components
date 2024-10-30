// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'vue3',
      ts: true,
      compiler: 'webpack5'
    }],
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      },
      "modules": false,  // 不转换 ES6 模块为 CommonJS
      "useBuiltIns": "usage",// 根据代码实际用到的功能引入 polyfills
      "corejs": "3"
    }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-syntax-dynamic-import"
  ]  //允许在代码中使用动态 import() 语法
}
