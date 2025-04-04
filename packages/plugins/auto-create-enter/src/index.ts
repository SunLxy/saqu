import { Compiler } from '@rspack/core';
import FS from 'fs-extra';
import path from 'path';
import { getMainCode, RouteType } from './utils';
import chokidar from 'chokidar';
import { S_Compiler } from 'saqu';

/**
 * 自动生成入口文件
 */
class AutoCreateEnter {
  /**路由类型*/
  routeType: RouteType = 'Hash';
  /**是否把 path==="/" 当成根路径 */
  rootRoutes?: boolean | string;
  /**主体内容*/
  mainContent?: string;
  /**全局样式文件地址*/
  globalStylePath: string = path.join(process.cwd(), 'src', 'global.css');
  /**入口文件地址*/
  mainFilePath: string = path.join(process.cwd(), 'src', '.cache', 'main.jsx');
  /**引入路由地址*/
  routePath?: string = './routes_config';
  /**加载路由外层组件*/
  warpOutlet?: string;

  constructor(props?: {
    routeType?: RouteType;
    rootRoutes?: boolean | string;
    routePath?: string;
    warpOutlet?: string;
  }) {
    if (props && props.routeType) {
      this.routeType = props.routeType;
    }
    if (props && props.routePath) {
      this.routePath = props.routePath;
    }
    if (props && props.warpOutlet) {
      this.warpOutlet = props.warpOutlet;
    }
    if (props && Reflect.has(props, 'rootRoutes')) {
      this.rootRoutes = props.rootRoutes;
    }
    this._create();
  }
  /**监听文件*/
  watch = () => {
    const watch = chokidar.watch(this.globalStylePath);
    watch.on('add', this._create);
    watch.on('unlink', this._create);
  };

  _checkStyle = () => {
    if (FS.existsSync(this.globalStylePath)) {
      return `import "@/global.css";\n`;
    }
    return '';
  };

  _create = () => {
    if (!this.mainContent) {
      /**获取配置代码*/
      this.mainContent = getMainCode(this.routeType, this.rootRoutes, this.routePath, this.warpOutlet);
    }
    let content = this.mainContent;
    const cssImport = this._checkStyle();
    if (cssImport) {
      content = cssImport + content;
    }
    /**获取写入文件路径*/
    if (!FS.existsSync(this.mainFilePath)) {
      /**初始化文件*/
      FS.ensureFileSync(this.mainFilePath);
    }
    /**写入内容*/
    FS.writeFileSync(this.mainFilePath, content, { flag: 'w+', encoding: 'utf-8' });
  };

  apply(compiler: S_Compiler) {
    /**在开始编译之前执行，只执行一次*/
    compiler.hooks.afterPlugins.tap('AutoCreateEnter', () => {
      this.watch();
    });
  }
}

export default AutoCreateEnter;
