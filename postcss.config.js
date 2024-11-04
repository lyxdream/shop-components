const postImport = require('postcss-import')
const postUrl = require('postcss-url')
const autoprefixer = require('autoprefixer')

const PostcssDiscardDuplicates = require('postcss-discard-duplicates') //去重
module.exports = {
  plugins: [
    autoprefixer(),
    postImport(),
    postUrl(),
    PostcssDiscardDuplicates(),
  ]
};