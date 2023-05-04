import { Compiler } from '@rspack/core';
import FS from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import { RouteAst } from './utils';

export interface AutoCreateRoutesProps {
  /**
   * 文件是否是默认导出
   * @default false
   */
  isDefault?: boolean;
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

class AutoConfigToRoutes {
  /**
   * 文件是否是默认导出
   * @default false
   */
  isDefault?: boolean = false;
  /**路由配置地址*/
  config_route_path: string = '';
  /**配置文件内容*/
  config_content: string = '';
  crate_routes_content: string = '';
  is_update_routes: boolean = true;
  /**路由配置根目录*/
  root_config_path: string = path.join(process.cwd(), 'config');
  /**监听文件方法*/
  watch: chokidar.FSWatcher;
  fileExt: string = '';

  constructor(props: AutoCreateRoutesProps = {}) {
    this.isDefault = props.isDefault || this.isDefault;
    this.config_route_path = this._getFile();
  }

  /**创建配置文件*/
  _create_config = () => {
    const writeFilePath = path.join(process.cwd(), 'src', '.cache', 'routes_config.jsx');
    // 设置缓存文件，把收集的进行存储
    FS.ensureFileSync(writeFilePath);
    FS.writeFileSync(writeFilePath, this.crate_routes_content, { flag: 'w+', encoding: 'utf-8' });
  };

  /**判断获取文件地址*/
  _getFile = () => {
    // 判断目录下是否存在文件
    const jsonPath = path.resolve(this.root_config_path, 'routes.json');
    const tsPath = path.resolve(this.root_config_path, 'routes.ts');
    const tsxPath = path.resolve(this.root_config_path, 'routes.tsx');
    const jsPath = path.resolve(this.root_config_path, 'routes.js');
    const jsxPath = path.resolve(this.root_config_path, 'routes.jsx');
    if (FS.existsSync(jsonPath)) {
      this.fileExt = 'json';
      return jsonPath;
    }
    if (FS.existsSync(tsPath)) {
      this.fileExt = 'ts';
      return tsPath;
    }
    if (FS.existsSync(tsxPath)) {
      this.fileExt = 'tsx';
      return tsxPath;
    }
    if (FS.existsSync(jsPath)) {
      this.fileExt = 'js';
      return jsPath;
    }
    if (FS.existsSync(jsxPath)) {
      this.fileExt = 'jsx';
      return jsxPath;
    }
    this.fileExt = '';
    return undefined;
  };

  /**读取文件内容*/
  _readFile = () => {
    this.is_update_routes = true;
    if (this.config_route_path) {
      /**读取文件内容*/
      let config_content = FS.readFileSync(this.config_route_path, 'utf-8');
      if (this.fileExt === 'json') {
        config_content = `export default ${config_content}`;
      }
      if (config_content !== this.config_content) {
        this.config_content = config_content;
        this.crate_routes_content = new RouteAst()._init(config_content);
      } else {
        this.is_update_routes = false;
      }
    } else {
      this.crate_routes_content = 'export default []';
    }
  };

  /**添加路由*/
  _addRoute = () => {
    this._getFile();
    this.watch.close();
    this._watch();
    this._readFile();
    this._create_config();
  };
  _changeRoute = () => {
    this._readFile();
    this._create_config();
  };
  /**删除路由*/
  _unlinkRoute = () => {
    //1. 进行重新获取监听文件
    this._getFile();
    this.watch.close();
    this._watch();
    this._readFile();
    this._create_config();
  };

  /**监听文件*/
  _watch() {
    this.watch = chokidar.watch(this.config_route_path || this.root_config_path);
    this.watch.on('add', this._addRoute);
    this.watch.on('change', this._changeRoute);
    this.watch.on('unlink', this._unlinkRoute);
  }

  apply(compiler: Compiler) {
    /**在开始编译之前执行，只执行一次*/
    compiler.hooks.afterPlugins.tap('AutoCreateRoutes', () => {
      this._watch();
    });
  }
}

export default AutoConfigToRoutes;
