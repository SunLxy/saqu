/**
 * rspack  配置入口文件
 */
import { RspackOptions } from '@rspack/core';
import chalk from 'chalk';
import { resolveApp } from '../paths';
import { fileExists } from '../../utils';

const getEnteyPath = (initEntry: string, initValue: string) => {
  let enteyFilePath: boolean | string = initEntry;
  if (/^!/.test(initEntry)) {
    const entery = initEntry.replace(/^!/, '');
    enteyFilePath = resolveApp(entery);
  } else {
    enteyFilePath = fileExists(resolveApp(initEntry || `src/${initValue}.{tsx,jsx,js}`));
  }
  return enteyFilePath;
};

export const getRspackEntryConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  initEntry?: RspackOptions['entry'],
): RspackOptions['entry'] => {
  /**默认入口文件为 src/index.(tsx|jsx|js)*/
  let initValue = 'index';
  if (type === 'server') {
    initValue = 'server';
  }
  let enteyFilePath: RspackOptions['entry'] | boolean = initEntry;
  if (initEntry && Array.isArray(initEntry)) {
    const lg = initEntry.length;
    let index = 0;
    enteyFilePath = [];
    for (index; index < lg; index++) {
      const element = initEntry[index];
      const result = getEnteyPath(element, initValue);
      if (typeof result === 'boolean') {
        break;
      }
      enteyFilePath.push(result);
    }
    if (typeof enteyFilePath === 'boolean' || !enteyFilePath) {
      console.log(chalk.green('项目入口文件 ', chalk.red(initEntry[index]), ' 不存在'));
      process.exit();
    }
  } else if (typeof initEntry === 'string' || !initEntry) {
    if (typeof initEntry === 'string' && /^!/.test(initEntry)) {
      const entery = initEntry.replace(/^!/, '');
      enteyFilePath = resolveApp(entery);
    } else {
      enteyFilePath = fileExists(resolveApp((initEntry as string) || `src/${initValue}.{tsx,jsx,js}`));
    }
    if (typeof enteyFilePath === 'boolean' || !enteyFilePath) {
      console.log(chalk.green('项目入口文件 ', chalk.red(initEntry || `src/${initValue}.{tsx,jsx,js}`), ' 不存在'));
      process.exit();
    }
    return enteyFilePath;
  }
  return initEntry;
};
