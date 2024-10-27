const path = require('path');
const consola = require('consola');
const chalk = require('chalk');
const fs = require('fs').promises;
const { glob } = require('fast-glob');
const { Project } =  require("ts-morph");
const { parse, compileScript } = require('@vue/compiler-sfc')

// 配置路径
const projectRoot = path.resolve(__dirname, '../');
const pkgRoot = path.resolve(projectRoot, 'packages');
const compRoot = path.resolve(pkgRoot, 'components');
const cqRoot = path.resolve(pkgRoot, 'cq-shop-components');
const buildOutput = path.resolve(projectRoot, 'lib');
const TSCONFIG_PATH = path.resolve(projectRoot, 'tsconfig.json');


// 排除文件
const excludeFiles = files => {
  const excludes = ["node_modules", "dist","examples","lib"];
  return files.filter(
    path => !excludes.some(exclude => path.includes(exclude))
  );
};
// // 路径重写器
// const pathRewriter = format => {
//   return id => {
//     id = id.replaceAll("@cq-shop-components", `cq-shop-components`);
//     return id;
//   };
// };


async function generateTypesDefinitions() {
  const project = new Project({
    compilerOptions: {
      allowJs: true,
      declaration: true,
      emitDeclarationOnly: true,// 仅仅抛出声明
      noEmitOnError: true,//如果有编译错误，则不生成任何输出文件。
      outDir: path.resolve(buildOutput, 'types'),
      baseUrl: projectRoot,
      skipLibCheck: true,
      strict: false,
    },
    tsConfigFilePath: TSCONFIG_PATH,
    skipAddingFilesFromTsConfig: true,
  });

  const globAnyFile = '**/*.{js?(x),ts?(x),vue}';

  //单个组件
  const filePaths = excludeFiles(
    await glob([globAnyFile, '!cq-shop-components/**/*'], {
      cwd: compRoot,//设置当前工作目录为 compRoot
      onlyFiles: true,//只匹配文件，不包括目录
      absolute: true,//返回绝对路径而不是相对路径
    })
  );

  //总包
  const cqPaths = excludeFiles(
    await glob([globAnyFile], {
      cwd: cqRoot,
      onlyFiles: true,
    })
  );

  // [ 'index.ts' ]
  const sourceFiles = [];
  let index = 1
  // 把 <script> 部分的内容提取出来进行解析
  await Promise.all([
    ...filePaths.map(async file => {
      if (file.endsWith('.vue')) {
        const content = await fs.readFile(file, 'utf8');
        const sfc = parse(content);
        const { script, scriptSetup } = sfc.descriptor;
        if (script || scriptSetup) {
          let content = script?.content ?? '';
          if (scriptSetup) {
            const compiled = compileScript(sfc.descriptor, {
              id: `${index++}`
            });
            content += compiled.content;
          }
          const lang = scriptSetup?.lang || script?.lang || 'js';
          // 生成从当前工作目录到文件的相对路径，并添加语言扩展名。
          const sourceFilePath =  `${path.relative(process.cwd(), file)}.${lang}`
          // file /Users/yinxia/Desktop/shop-components/packages/components/base/button/src/index.vue
          // sourceFilePath packages/components/base/button/src/index.vue.ts
          const sourceFile = project.createSourceFile(
            sourceFilePath,
            content
          );
          sourceFiles.push(sourceFile);
        }
      } else if (file.endsWith('.ts')) {
        // /Users/yinxia/Desktop/shop-components/packages/components/base/button/index.ts
        const sourceFile = project.addSourceFileAtPath(file);
        sourceFiles.push(sourceFile);
      }
    }),
    ...cqPaths.map(async file => {
      const content = await fs.readFile(path.resolve(cqRoot, file), 'utf-8');
      const sourceFilePath = path.resolve(pkgRoot, file)
      //Users/yinxia/Desktop/shop-components/packages/index.ts
      sourceFiles.push(
        project.createSourceFile(sourceFilePath, content)
      );

    }),
  ]);
  //生成声明文件 不生成对应的 JavaScript 文件。
  await project.emit({
    emitOnlyDtsFiles: true,
  });
  // sourceFiles.length  7  不包含util文件夹里面的
  const tasks = sourceFiles.map(async sourceFile => {
    // /Users/yinxia/Desktop/shop-components/packages/index.ts
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath());
    consola.trace(chalk.yellow(`Generating definition for file: ${chalk.bold(relativePath)}`));
    const emitOutput = sourceFile.getEmitOutput();
    const emitFiles = emitOutput.getOutputFiles();
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`); //index.ts
    }

    const writeTasks = emitFiles.map(async outPutFile => {
      const filePath = outPutFile.getFilePath(); //生成d.ts文件
      consola.success( chalk.green(
        `filePath for file: ${chalk.bold(filePath)}`
      ))
      //  /Users/yinxia/Desktop/shop-components/lib/types/packages/index.d.ts
      // /Users/yinxia/Desktop/shop-components/lib/types/index.d.ts
      await fs.mkdir(path.dirname(filePath), {
        recursive: true, //递归
      });
      await fs.writeFile(
        filePath,
        outPutFile.getText(),
        'utf8'
      );
      consola.success(
        chalk.green(
          `Definition for file: ${chalk.bold(relativePath)} generated`
        )
      );
    });
    await Promise.all(writeTasks);
  });
  await Promise.all(tasks);
}
class GenerateTypesPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('GenerateTypesPlugin', async () => {
      await generateTypesDefinitions();
    });
  }
}
module.exports = GenerateTypesPlugin;