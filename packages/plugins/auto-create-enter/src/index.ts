import { Compiler } from '@rspack/core';
import FS from 'fs-extra';
import path from 'path';
import { getMainCode, RouteType } from './utils';

/**
 * 自动生成入口文件
 */
class AutoCreateEnter {
  /**路由类型*/
  routeType: RouteType = 'Hash';
  /**是否把 path==="/" 当成根路径 */
  rootRoutes?: boolean | string;

  constructor(props?: { routeType?: RouteType; rootRoutes?: boolean }) {
    if (props && props.routeType) {
      this.routeType = props.routeType;
    }
    if (props && Reflect.has(props, 'rootRoutes')) {
      this.rootRoutes = props.rootRoutes;
    }
  }

  _create() {
    /**获取配置代码*/
    const code = getMainCode(this.routeType, this.rootRoutes);
    /**获取写入文件路径*/
    const writeFilePath = path.join(process.cwd(), 'src', '.cache', 'main.jsx');
    /**初始化文件*/
    FS.ensureFileSync(writeFilePath);
    /**写入内容*/
    FS.writeFileSync(writeFilePath, code, { flag: 'w+', encoding: 'utf-8' });
  }

  apply(compiler: Compiler) {
    /**在开始编译之前执行，只执行一次*/
    compiler.hooks.afterPlugins.tap('AutoCreateEnter', () => {
      this._create();
    });
  }
}

export default AutoCreateEnter;
