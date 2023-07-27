import FS from 'fs-extra';

export type IgnoreFunction = (file: string, stats: FS.Stats) => boolean;
export type Ignores = ReadonlyArray<string | IgnoreFunction>;

export interface TreeDataType {
  path: string;
  indexFile?: string;
  children: TreeDataType[];
}

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

export interface RouteTreeDataType {
  [x: string]: RouteItemConfigType | RouteTreeDataType;
}

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
export type GetFilesPathProps = {
  fileExt?: string;
  ignores?: Ignores;
};

export interface TreeObjectDataType {
  index?: string;
  [x: string]: TreeObjectDataType | string;
}

export interface AutoCreateTreeRoutesProps extends GetFilesPathProps {
  /**
   * 文件是否是默认导出
   * @default false
   */
  isDefault?: boolean;
  /**自定义设置配置*/
  renderConfig?: (props: Required<RouteItemConfigType>) => RenderReturnType;
  /**预设导入内容*/
  presetsImport?: string;
  rootRoutes?: boolean | string;
  renderParent?: (pathName: string) => { path: string; configStr: string };
}
