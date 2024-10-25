const { glob } = require('fast-glob');
const { parse, compileScript } = require('@vue/compiler-sfc');
import { Project, SourceFile } from "ts-morph";
const fs = require('fs').promises;
const path = require('path');
const consola = require('consola');
const chalk = require('chalk');
let index = 1


// 配置路径
const projectRoot = path.resolve(__dirname, '../');
const pkgRoot = path.resolve(projectRoot, 'packages');
const compRoot = path.resolve(pkgRoot, 'components');
const cqRoot = path.resolve(pkgRoot, 'cq-shop-components');
const buildOutput = path.resolve(projectRoot, 'lib');
const TSCONFIG_PATH = path.resolve(projectRoot, 'tsconfig.json');


// 排除文件
const excludeFiles = (files: string[]) => {
  const excludes = ["node_modules", "dist","examples","lib"];
  return files.filter(
    path => !excludes.some(exclude => path.includes(exclude))
  );
};


// 路径重写器
export const pathRewriter = format => {
  return (id: string) => {
    id = id.replaceAll("@cq-shop-components", `cq-shop-components/${format}`);
    return id;
  };
};

// 生成类型定义
const generateTypesDefinitions = async () => {
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
      cwd: compRoot,
      onlyFiles: true,
      absolute: true,
    })
  );

  //总包
  const cqPaths = excludeFiles(
    await glob([globAnyFile], {
      cwd: cqRoot,
      onlyFiles: true,
    })
  );

  const sourceFiles: SourceFile[] = [];

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
          const sourceFile = project.createSourceFile(
            `${path.relative(process.cwd(), file)}.${lang}`,
            content
          );
          sourceFiles.push(sourceFile);
        }
      } else if (file.endsWith('.ts')) {
        const sourceFile = project.addSourceFileAtPath(file);
        sourceFiles.push(sourceFile);
      }
    }),
    ...cqPaths.map(async file => {
      const content = await fs.readFile(path.resolve(cqRoot, file), 'utf-8');
      sourceFiles.push(
        project.createSourceFile(path.resolve(pkgRoot, file), content)
      );
    }),
  ]);

  //生成声明文件 不生成对应的 JavaScript 文件。
  try {
    project.emit({ emitOnlyDtsFiles: true });
  } catch (error) {
    console.error('Compilation error:', error);
  }
  console.log(sourceFiles,'==sourceFiles')
  const tasks = sourceFiles.map(async sourceFile => {
    const relativePath = path.relative(pkgRoot, sourceFile.getFilePath());
    consola.trace(chalk.yellow(`Generating definition for file: ${chalk.bold(relativePath)}`));

    const emitOutput = sourceFile.getEmitOutput();
    const emitFiles = emitOutput.getOutputFiles();
    if (emitFiles.length === 0) {
      throw new Error(`Emit no file: ${chalk.bold(relativePath)}`);
    }

    const writeTasks = emitFiles.map(async outPutFile => {
      const filePath = outPutFile.getFilePath();
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(
        filePath,
        pathRewriter('es')(outPutFile.getText()),
        'utf8'
      );

      consola.success(chalk.green(`Definition for file: ${chalk.bold(relativePath)} generated`));
    });

    await Promise.all(writeTasks);

  });

  await Promise.all(tasks);
};

// 执行生成类型定义
generateTypesDefinitions().catch(err => {
  console.error('Error generating types:', err);
  process.exit(1);
});