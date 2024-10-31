class RemoveDuplicateRootHostPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('RemoveDuplicateRootHostPlugin', (compilation, callback) => {
      const cssFiles = Object.keys(compilation.assets).filter(asset => /\.css$/.test(asset));

      for (const file of cssFiles) {
        let content = compilation.assets[file].source();

        // 匹配所有的 :root 和 :host 声明
        const rootHostRegex = /(:root|:host)\s*\{[^}]*\}/g;
        const matches = content.match(rootHostRegex);

        if (matches && matches.length > 1) {
          // 提取所有的变量声明
          const variableDeclarations = new Map();

          matches.forEach(match => {
            const declaration = match.replace(/(:root|:host)\s*\{/, '').replace(/\}/, '');
            declaration.split(';').forEach(decl => {
              const [property, value] = decl.trim().split(':');
              if (property && value) {
                variableDeclarations.set(property.trim(), value.trim());
              }
            });
          });

          // 合并所有的变量声明到一个 :root, :host 中
          const combinedRootHost = `:root, :host {${[...variableDeclarations.entries()].map(([prop, val]) => `${prop}: ${val};`).join('')}}`;

          // 移除原始的 :root 和 :host 声明
          const newContent = content.replace(rootHostRegex, '');

          // 将合并后的 :root, :host 声明添加回内容中
          const finalContent = combinedRootHost + newContent;

          // 更新编译资产
          compilation.assets[file] = {
            source: () => finalContent,
            size: () => finalContent.length,
          };
        }
      }

      callback();
    });
  }
}

module.exports = RemoveDuplicateRootHostPlugin;