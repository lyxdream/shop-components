// 合并声明
function combineDeclarations(existing, newDeclarations) {
  const declarationMap = new Map();
  // 处理已有的声明
  existing.split(';').forEach(decl => {
    if (decl.trim()) {
      const [prop, value] = decl.split(':');
      declarationMap.set(prop.trim(), value.trim());
    }
  });
  // 处理新加入的声明，如果有重复则覆盖
  newDeclarations.split(';').forEach(decl => {
    if (decl.trim()) {
      const [prop, value] = decl.split(':');
      declarationMap.set(prop.trim(), value.trim());
    }
  });
  // 重新组合成字符串
  return Array.from(declarationMap, ([prop, value]) => `${prop}: ${value};`).join(' ');
}

// 压缩代码
function compressCss(css) {
  // 移除注释
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  // 移除多余的空格和换行符
  css = css.replace(/\s+/g, ' ').trim();
  // 移除选择器和大括号之间的空格
  css = css.replace(/\s*{\s*/g, '{');
  css = css.replace(/\s*}\s*/g, '}');
  // 移除声明之间的多余空格
  css = css.replace(/\s*;\s*/g, ';');
  css = css.replace(/\s*:\s*/g, ':');
  return css;
}

class RemoveDuplicateCssPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('RemoveDuplicateCssPlugin', compilation => {
      // 遍历所有的 CSS 资源
      for (const name in compilation.assets) {
        if (name.endsWith('.css')) {
          try {
            const originalCss = compilation.assets[name].source();
            const uniqueCss = this.removeDuplicateStyles(originalCss);
            compilation.assets[name] = {
              source: () => uniqueCss,
              size: () => uniqueCss.length
            };
          } catch (error) {
            console.error(`Error processing CSS file ${name}:`, error);
          }
        }
      }
    });
  }

  removeDuplicateStyles(cssText) {
    const styleMap = new Map();
    
    // 使用正则表达式匹配所有的CSS规则
    const rules = cssText.match(/([^{]+)\{([^}]+)\}/g);
  
    if (!rules) return '';
  
    rules.forEach(rule => {
      const [selector, declarations] = rule.split(/\{|\}/).slice(0, 2);
      const trimmedSelector = selector.trim();
      const trimmedDeclarations = declarations.trim();
  
      if (styleMap.has(trimmedSelector)) {
        // 如果已经存在相同的selector，则合并声明
        const existingDeclarations = styleMap.get(trimmedSelector);
        const combinedDeclarations = combineDeclarations(existingDeclarations, trimmedDeclarations);
        styleMap.set(trimmedSelector, combinedDeclarations);
      } else {
        // 否则直接添加新的规则
        styleMap.set(trimmedSelector, trimmedDeclarations);
      }
    });
  
    // 将Map转换回CSS文本
    let resultCss = '';
    styleMap.forEach((declarations, selector) => {
      resultCss += `${selector} { ${declarations} }\n`;
    });
  
    return compressCss(resultCss);
  }
}

module.exports = RemoveDuplicateCssPlugin;