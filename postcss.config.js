
const PostcssDiscardDuplicates = require('postcss-discard-duplicates') //去重
module.exports = {
  plugins: [
    PostcssDiscardDuplicates(),
  ]
};