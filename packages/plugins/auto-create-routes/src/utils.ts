import recursive from 'recursive-readdir';
import FS from 'fs-extra';
import path from 'path';

export type IgnoreFunction = (file: string, stats: FS.Stats) => boolean;
export type Ignores = ReadonlyArray<string | IgnoreFunction>;

const ignoreFunc = (fileExt: string, file: string, stats: FS.Stats) => {
  const rgx = new RegExp(`index.(${fileExt})$`);
  if (rgx.test(file) && stats.isFile()) {
    return false;
  } else if (stats.isDirectory()) {
    return false;
  }
  return true;
};

export type GetFilesPathProps = {
  fileExt?: string;
  ignores?: Ignores;
};

/**获取自动生成地址*/
export const getFilesPath = (currentPath: string, props: GetFilesPathProps = {}): Promise<string[]> => {
  const { fileExt = 'tsx|js|jsx', ignores } = props;
  let newIgnores: Ignores = [(...rest) => ignoreFunc(fileExt, ...rest)];
  if (Array.isArray(ignores) && ignores.length > 0) {
    newIgnores = ignores;
  }
  return new Promise((resolve, reject) => {
    recursive(currentPath, newIgnores, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
};

export const isCheckIgnoresFile = (filePath: string, fileExt: string = 'tsx|js|jsx', ignores: Ignores) => {
  const stats = FS.statSync(filePath);
  if (ignores) {
    const result = ignores.map((item) => {
      if (typeof item === 'string') {
        const rgx = new RegExp(`${item}`);
        return rgx.test(filePath);
      }
      if (typeof item === 'function') {
        return item(filePath, stats);
      }
      return true;
    });
    // 表示文件忽略
    if (result.includes(true)) {
      return false;
    }
  }
  const filename = path.basename(filePath);
  const rgx = new RegExp(`index.(${fileExt})$`);
  if (rgx.test(filename) && stats.isFile()) {
    return true;
  }
  // 表示文件忽略
  return false;
};

export const toPascalCase = (str: string = '') =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('');

export const getRouterPath = (filePath: string) => {
  // 1. 跳转地址
  // 2. 引入名称
  const rootDir = path.resolve(process.cwd(), 'src');
  const newFilePath = filePath
    .replace(rootDir, '')
    .replace(path.extname(filePath), '')
    .replace(/\\/g, '/')
    .replace(/^\//, '')
    .replace(/\/index$/, '');
  const oFilePath = filePath.replace(rootDir, '').replace(/\\/g, '/').replace(/^\//, '');
  const componentName = toPascalCase(newFilePath.replace(path.sep, ' '));
  const pathName = newFilePath.replace('pages', '');
  return {
    componentName,
    newFilePath: `@/` + newFilePath,
    pathName: pathName || '/',
    oFilePath: `@/` + oFilePath,
  };
};

export type RouteItemConfigType = {
  /**引入组件名称*/
  componentName: string;
  /**页面引入地址*/
  newFilePath: string;
  /**路由跳转地址*/
  pathName: string;
  /**未处理后缀之类的页面引入地址*/
  oFilePath: string;
  /**在当前生成路由的数组中下标位置*/
  index?: number;
};
export type RenderReturnType = {
  /**
   * @description 引入字符串
   * @example `import * as ${ComName} from "${newFilePath}";\n`
   * @todo 其中的  ComName 为 componentName和index 进行拼接字符串;
   */
  importStr?: string;
  /**
   * @description 结构赋值字符串
   * @example `const { default:${ComName}Default,...${ComName}Other  } = ${ComName};\n`
   * @todo 其中的  ComName 为 componentName和index 进行拼接字符串;
   */
  otherStr?: string;
  /**
   * @description 路由配置对象字符串
   * @example `\t{ path:"${pathName}",element:<${ComName}Default />,...${ComName}Other },\n`
   * @todo 其中的  ComName 为 componentName和index 进行拼接字符串;
   */
  configStr?: string;
};

export const getRoutesConfig = (
  paths: Map<string, RouteItemConfigType>,
  isDefault: boolean,
  render?: (props: Required<RouteItemConfigType>) => RenderReturnType,
  presetsImport?: string,
  rootRoutes?: boolean | string,
) => {
  let configStr = '';
  let importStr = (presetsImport || '') + '\n';
  let otherStr = '';
  let importLazyStr = '';
  let index = 0;

  let firstItem = '';

  paths.forEach((rowItem) => {
    index++;
    const { pathName, componentName, newFilePath } = rowItem;
    /**直接自定义生成配置*/
    if (render && typeof render === 'function') {
      const result = render({ ...rowItem, index });
      importStr += result.importStr || '';
      otherStr += result.otherStr || '';
      if (rootRoutes && typeof rootRoutes === 'boolean' && rowItem.pathName === '/') {
        firstItem = result.otherStr || '';
      } else {
        configStr += result.configStr || '';
      }
    } else {
      const ComName = componentName + `${index}`;
      importStr += `import * as ${ComName} from "${newFilePath}";\n`;
      otherStr += `const { default:${ComName}Default,...${ComName}Other  } = ${ComName};\n`;
      const elementStr = isDefault ? `,element:<${ComName}Default />` : '';
      if (rootRoutes && typeof rootRoutes === 'boolean' && rowItem.pathName === '/') {
        firstItem = ` path:"${pathName}"${elementStr},...${ComName}Other `;
      } else {
        configStr += `\t{ path:"${pathName}"${elementStr},...${ComName}Other },\n`;
      }
    }
  });
  let newConfig = ` [\n${configStr.trim()}]`;
  if (rootRoutes && typeof rootRoutes === 'boolean' && firstItem) {
    newConfig = `[\n\t{${firstItem},\n\tchildren:[\n\t${configStr.trim()}\n\t] \n\t},\n]`;
  }
  if (rootRoutes && typeof rootRoutes === 'string') {
    importStr = `import RootRoutes from "${rootRoutes}";\n` + importStr;
    return `${importStr.trim()}\n${otherStr.trim()}\n${importLazyStr.trim()}\nexport default [\n\t{ path:"/",element:<RootRoutes />,children: ${newConfig} \n\t}\n\t];\n`;
  }

  return `${importStr.trim()}\n${otherStr.trim()}\n${importLazyStr.trim()}\nexport default ${newConfig};\n`;
};
