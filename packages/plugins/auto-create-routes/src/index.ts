import { Compiler } from '@rspack/core';
import FS from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import {
  getFilesPath,
  Ignores,
  GetFilesPathProps,
  getRoutesConfig,
  getRouterPath,
  RouteItemConfigType,
  RenderReturnType,
  isCheckIgnoresFile,
} from './utils';

export interface AutoCreateRoutesProps extends GetFilesPathProps {
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
}

// 插件执行顺序

// 1. `beforeRun`: 在开始编译之前执行，只执行一次。
// 2. `run`: 在开始编译时执行，只执行一次。
// 3. `initialize`: 在初始化编译器时执行，只执行一次。
// 4. `environment`: 在设置编译环境时执行，只执行一次。
// 5. `afterEnvironment`: 在设置编译环境后执行，只执行一次。
// 6. `entryOption`: 在设置入口选项时执行，只执行一次。
// 7. `afterPlugins`: 在设置插件后执行，只执行一次。
// 8. `afterResolvers`: 在设置解析器后执行，只执行一次。
// 9. `beforeCompile`: 在开始编译前执行，可以修改编译配置。
// 10. `compile`: 在开始编译时执行，可以修改编译配置。
// 11. `thisCompilation`: 在创建新的编译对象时执行，可以修改编译对象。
// 12. `compilation`: 在创建新的编译对象时执行，可以修改编译对象。
// 13. `make`: 在编译过程中执行，可以修改编译对象。
// 14. `afterCompile`: 在编译完成后执行，可以访问编译结果。
// 15. `emit`: 在生成资源之前执行，可以修改生成的资源。
// 16. `afterEmit`: 在生成资源之后执行，可以执行一些清理工作。
// 17. `done`: 在编译完成后执行，只执行一次。
// 18. `failed`: 在编译失败时执行，只执行一次。
// 19. `invalid`: 在编译无效时执行，只执行一次。
// 20. `watchRun`: 在开始监听文件变化时执行，可以执行一些准备工作。
// 21. `watchClose`: 在停止监听文件变化时执行，可以执行一些清理工作。
// 22. `infrastructureLog`: 在记录日志时执行，可以修改日志输出。

// 注意：以上执行顺序仅供参考，具体执行顺序可能会因为不同的配置和插件而有所不同。

class AutoCreateRoutes {
  /**
   * 匹配文件后缀
   * @default 'tsx|js|jsx'
   */
  fileExt?: string = 'tsx|js|jsx';
  /**自定义规则*/
  ignores?: Ignores;
  /**
   * 文件是否是默认导出
   * @default false
   */
  isDefault?: boolean = false;
  /**自定义设置配置*/
  renderConfig?: (props: Required<RouteItemConfigType>) => RenderReturnType;
  /**预设导入内容*/
  presetsImport?: string;
  private tempRoutesPathsMap: Map<string, RouteItemConfigType> = new Map([]);
  rootRoutes: boolean | string = false;

  constructor(props: AutoCreateRoutesProps = {}) {
    this.fileExt = props.fileExt || 'tsx|js|jsx';
    this.ignores = props.ignores;
    this.isDefault = props.isDefault || this.isDefault;
    this.renderConfig = props.renderConfig;
    this.presetsImport = props.presetsImport || '';
    this.rootRoutes = props.rootRoutes || this.rootRoutes;
    this._getRoutesPath();
  }

  /**创建配置文件*/
  _create_config = () => {
    const writeFilePath = path.join(process.cwd(), 'src', '.cache', 'routes_config.jsx');
    // 设置缓存文件，把收集的进行存储
    FS.ensureFileSync(writeFilePath);
    const routes_config = getRoutesConfig(
      this.tempRoutesPathsMap,
      this.isDefault,
      this.renderConfig,
      this.presetsImport,
      this.rootRoutes,
    );
    FS.writeFileSync(writeFilePath, routes_config, { flag: 'w+', encoding: 'utf-8' });
  };

  /**
   * 获取 src/pages/** index.{tsx|jsx|js}
   */
  _getRoutesPath = async () => {
    const pagesPath = path.join(process.cwd(), 'src', 'pages');
    const tempRoutesPaths = await getFilesPath(pagesPath, {
      fileExt: this.fileExt,
      ignores: this.ignores,
    });
    tempRoutesPaths.forEach((filePath) => {
      const { pathName, ...rest } = getRouterPath(filePath);
      this.tempRoutesPathsMap.set(pathName, { ...rest, pathName });
    });
    this._create_config();
  };

  /**添加路由*/
  _addRoute = (filePath: string) => {
    if (!isCheckIgnoresFile(filePath, this.fileExt, this.ignores)) {
      return;
    }
    const { pathName, ...rest } = getRouterPath(filePath);
    this.tempRoutesPathsMap.set(pathName, { ...rest, pathName });
    this._create_config();
  };
  /**删除路由*/
  _unlinkRoute = (filePath: string) => {
    const { pathName } = getRouterPath(filePath);
    this.tempRoutesPathsMap.delete(pathName);
    this._create_config();
  };

  /**监听文件*/
  watch() {
    const pagesPath = path.join(process.cwd(), 'src', 'pages');
    const watch = chokidar.watch(pagesPath);
    watch.on('add', this._addRoute);
    watch.on('unlink', this._unlinkRoute);
  }

  apply(compiler: any) {
    /**在开始编译之前执行，只执行一次*/
    (compiler as Compiler).hooks.afterPlugins.tap('AutoCreateRoutes', () => {
      this.watch();
    });
  }
}

export default AutoCreateRoutes;
