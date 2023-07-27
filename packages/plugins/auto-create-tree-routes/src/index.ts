import { Compiler } from '@rspack/core';
import FS from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import { toMatcherFunction, recursiveReaddir } from './recursive-readdir';
import { IgnoreFunction, Ignores, RouteTreeDataType, AutoCreateTreeRoutesProps } from './interface';
import { createTreeObjectRoutes, addRoutes, removeRoutes, isCheckIgnoresFile, createRouteCode } from './utils';
export * from './interface';

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

class AutoCreateTreeRoutes {
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
  renderConfig?: AutoCreateTreeRoutesProps['renderConfig'];
  renderParent?: AutoCreateTreeRoutesProps['renderParent'];
  /**预设导入内容*/
  presetsImport?: string;
  rootRoutes: boolean | string = false;

  matchIgnores: IgnoreFunction[] = [];

  pagesPath = path.join(process.cwd(), 'src', 'pages');

  writeFilePath = path.join(process.cwd(), 'src', '.cache', 'routes_config.jsx');

  routesTreeData: RouteTreeDataType = {};

  mapPaths: Map<string, boolean> = new Map([]);

  constructor(props: AutoCreateTreeRoutesProps = {}) {
    this.fileExt = props.fileExt || 'tsx|js|jsx';
    this.ignores = props.ignores;
    this.isDefault = props.isDefault || this.isDefault;
    this.renderConfig = props.renderConfig;
    this.renderParent = props.renderParent;
    this.presetsImport = props.presetsImport || '';
    this.rootRoutes = props.rootRoutes || this.rootRoutes;
    this.matchIgnores = (props.ignores || []).map(toMatcherFunction);
    // 设置缓存文件，把收集的进行存储
    FS.ensureFileSync(this.writeFilePath);
    this._getRoutesPath();
  }

  /**创建配置文件*/
  _create_config = () => {
    // render ?: (props: Required<RouteItemConfigType>) => RenderReturnType,
    //   presetsImport ?: string,
    //   rootRoutes ?: boolean | string,
    const resultData = createRouteCode(
      this.routesTreeData,
      this.isDefault,
      this.renderConfig,
      this.renderParent,
      this.presetsImport,
      this.rootRoutes,
    );
    FS.writeFileSync(this.writeFilePath, resultData, { flag: 'w+', encoding: 'utf-8' });
  };

  /**
   * 获取 src/pages/** index.{tsx|jsx|js}
   */
  _getRoutesPath = async () => {
    const result = recursiveReaddir(this.pagesPath, this.matchIgnores, this.fileExt, this.pagesPath, this.mapPaths);
    this.routesTreeData = createTreeObjectRoutes(result);
    this._create_config();
  };

  /**添加路由*/
  _addRoute = (filePath: string) => {
    const check = isCheckIgnoresFile(filePath, this.fileExt, this.matchIgnores);
    /**判断数据是否符合规则*/
    if (!check) {
      return;
    }
    /**如果已经存在，则不用进行数据处理*/
    if (this.mapPaths.get(filePath)) {
      return;
    }
    this.routesTreeData = addRoutes(filePath, this.routesTreeData);
    this._create_config();
  };

  /**删除路由*/
  _unlinkRoute = (filePath: string) => {
    const result = removeRoutes(filePath, this.routesTreeData);
    /**判断是否删除数据了*/
    if (result) {
      this._create_config();
    }
  };

  /**监听文件*/
  watch() {
    const watch = chokidar.watch(this.pagesPath);
    watch.on('add', this._addRoute);
    watch.on('unlink', this._unlinkRoute);
  }

  apply(compiler: Compiler) {
    /**在开始编译之前执行，只执行一次*/
    compiler.hooks.afterPlugins.tap('AutoCreateTreeRoutes', () => {
      this.watch();
    });
  }
}

export default AutoCreateTreeRoutes;
