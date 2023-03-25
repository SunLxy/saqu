/**
 * rspack  配置入口文件
 */
import path from 'path';
// import chalk from 'chalk';
import { fileExists } from '../utils';
export const getRspackEntryConfig = (type: 'server' | 'client', initEntry?: string): string => {
  /**默认入口文件为 src/index.(tsx|jsx|js)*/
  let initValue = 'index';
  if (type === 'server') {
    initValue = 'server';
  }
  const enteyFilePath = fileExists(path.join(process.cwd(), initEntry || `src/${initValue}.{tsx,jsx,js}`));
  if (typeof enteyFilePath === 'boolean') {
    console.log('项目入口文件' + initEntry || `src/${initValue}.{tsx,jsx,js}` + '不存在');
    process.exit();
  }
  return enteyFilePath;
};
