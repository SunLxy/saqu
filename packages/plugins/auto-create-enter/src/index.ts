import { Compiler } from '@rspack/core';
import FS from 'fs-extra';
import path from 'path';
import { getMainCode, RouteType } from './utils';
/**
 * 自动生成路由
 */
class AutoCreateEnter {
  routeType: RouteType = 'Hash';
  isRoot: boolean = false;
  constructor(props?: { routeType?: RouteType; isRoot?: boolean }) {
    if (props && props.routeType) {
      this.routeType = props.routeType;
    }
    if (props && Reflect.has(props, 'isRoot')) {
      this.isRoot = props.isRoot;
    }
  }

  _create() {
    const code = getMainCode(this.routeType, this.isRoot);
    const writeFilePath = path.join(process.cwd(), 'src', '.cache', 'main.jsx');
    FS.ensureFileSync(writeFilePath);
    FS.writeFileSync(writeFilePath, code, { flag: 'w+', encoding: 'utf-8' });
  }

  apply(compiler: Compiler) {
    /**在开始编译之前执行，只执行一次*/
    compiler.hooks.afterPlugins.tap('AutoCreateEnter', () => {
      console.log('AutoCreateEnter');
      this._create();
    });
  }
}

export default AutoCreateEnter;
