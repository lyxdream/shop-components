
const PostcssDiscardDuplicates = require('postcss-discard-duplicates') //去重
const postcssCustomProperties = require('postcss-custom-properties');  //移除css变量声明
module.exports = {
  plugins: [
    postcssCustomProperties({
      preserve: false, // 移除变量声明
    }),
    PostcssDiscardDuplicates(),
  ]
};