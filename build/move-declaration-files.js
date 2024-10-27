// move-declaration-files.js
const fs = require('fs');
const path = require('path');

// 源文件路径
const sourceFilePath = path.resolve('./temp-types/packages/cq-shop-components/index.d.ts');
// 目标文件路径
const targetFilePath = path.resolve('./packages/index.d.ts');

// 确保目标目录存在
const targetDir = path.dirname(targetFilePath);
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 移动文件
fs.rename(sourceFilePath, targetFilePath, (err) => {
  if (err) throw err;
  console.log(`Moved ${sourceFilePath} to ${targetFilePath}`);
});

// 清理临时目录
const tempDir = path.resolve('./temp-types');
fs.rmdir(tempDir, { recursive: true }, (err) => {
  if (err) throw err;
  console.log(`Removed temporary directory: ${tempDir}`);
});