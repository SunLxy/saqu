import FS from 'fs-extra';
import path from 'path';
import { IgnoreFunction, Ignores } from './interface';

export type GetFilesPathProps = {
  fileExt?: string;
  ignores?: Ignores;
};

export const isCheckIgnoresFile = (
  filePath: string,
  fileExt: string = 'tsx|js|jsx',
  matchIgnores: IgnoreFunction[],
) => {
  const stats = FS.statSync(filePath);
  if (matchIgnores) {
    const isNotNext = matchIgnores.some(function (matcher) {
      return matcher(filePath, stats);
    });
    if (isNotNext) {
      return false;
    }
  }
  const rgx = new RegExp(`index.(${fileExt})$`);
  if (rgx.test(filePath) && stats.isFile()) {
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
