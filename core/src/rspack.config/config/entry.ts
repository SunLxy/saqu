/**
 * rspack  配置入口文件
 */
import chalk from 'chalk';
import { resolveApp } from '../paths';
import { fileExists } from '../../utils';
export const getRspackEntryConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  initEntry?: string,
): string => {
  /**默认入口文件为 src/index.(tsx|jsx|js)*/
  let initValue = 'index';
  if (type === 'server') {
    initValue = 'server';
  }

  let enteyFilePath: string | boolean = initEntry;

  if (/^!/.test(initEntry)) {
    const entery = initEntry.replace(/^!/, '');
    enteyFilePath = resolveApp(entery);
  } else {
    enteyFilePath = fileExists(resolveApp(initEntry || `src/${initValue}.{tsx,jsx,js}`));
  }
  if (typeof enteyFilePath === 'boolean' || !enteyFilePath) {
    console.log(chalk.green('项目入口文件 ', chalk.red(initEntry || `src/${initValue}.{tsx,jsx,js}`), ' 不存在'));
    // console.log('项目入口文件' + initEntry || `src/${initValue}.{tsx,jsx,js}` + '不存在');
    process.exit();
  }
  return enteyFilePath;
};
