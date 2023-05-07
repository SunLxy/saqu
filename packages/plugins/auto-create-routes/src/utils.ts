import recursive from 'recursive-readdir';
import FS from 'fs-extra';
import path from 'path';

export type IgnoreFunction = (file: string, stats: FS.Stats) => boolean;
export type Ignores = ReadonlyArray<string | IgnoreFunction>;

const ignoreFunc = (fileExt: string, file: string, stats: FS.Stats) => {
  const rgx = new RegExp(`index.(${fileExt})$`);

  if ((rgx.test(file) && stats.isFile) || stats.isDirectory()) {
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
) => {
  let configStr = '';
  let importStr = (presetsImport || '') + '\n';
  let otherStr = '';
  let importLazyStr = '';
  let index = 0;

  paths.forEach((rowItem) => {
    index++;
    const { pathName, componentName, newFilePath } = rowItem;
    /**直接自定义生成配置*/
    if (render && typeof render === 'function') {
      const result = render({ ...rowItem, index });
      importStr += result.importStr || '';
      otherStr += result.otherStr || '';
      configStr += result.configStr || '';
    } else {
      const ComName = componentName + `${index}`;
      importStr += `import * as ${ComName} from "${newFilePath}";\n`;
      otherStr += `const { default:${ComName}Default,...${ComName}Other  } = ${ComName};\n`;
      const elementStr = isDefault ? `,element:<${ComName}Default />` : '';
      configStr += `\t{ path:"${pathName}"${elementStr},...${ComName}Other },\n`;
    }
  });
  return `${importStr}\n${otherStr}\n${importLazyStr}\nexport default [\n${configStr}];\n`;
};
