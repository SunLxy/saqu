/**
 * rspack  配置入口文件
 */
import { RspackOptions } from '@rspack/core';
import chalk from 'chalk';
import { resolveApp } from '../paths';
import { fileExists } from '../../utils';

type EntryItem = string | string[];

type EntryDescription = {
  import: EntryItem;
  runtime?: string | false;
};

type EntryObject = {
  [k: string]: EntryItem | EntryDescription;
};

type Config = {
  entry: EntryItem | EntryObject;
};

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
  if (Array.isArray(initEntry)) {
    return checkArray(initValue, initEntry);
  } else if (typeof initEntry === 'string' || !initEntry) {
    return checkString(initValue, initEntry as string);
  }
  return initEntry;
};

/**当是字符串获取不存在值的时候*/
const checkString = (initValue: string, initEntry?: string) => {
  const result = getEnteyPath(initValue, initEntry);
  if (typeof result === 'boolean' || !result) {
    console.log(chalk.green('项目入口文件 ', chalk.red(initEntry || `src/${initValue}.{tsx,jsx,js}`), ' 不存在'));
    process.exit();
  }
  return result;
};

/**当数组的时候*/
const checkArray = (initValue: string, initEntry: string[]) => {
  try {
    const newList = initEntry.filter(Boolean);
    const lg = newList.length;
    if (lg === 0) {
      const enteyFilePath = fileExists(resolveApp(`src/${initValue}.{tsx,jsx,js}`));
      if (typeof enteyFilePath === 'boolean' || !enteyFilePath) {
        console.log(chalk.green('项目入口文件 ', chalk.red(`src/${initValue}.{tsx,jsx,js}`), ' 不存在'));
        process.exit();
      }
      return enteyFilePath;
    } else {
      let index = 0;
      let list: string[] = [];
      for (index; index < lg; index++) {
        const element = newList[index];
        const result = getEnteyPath(initValue, element);
        if (typeof result === 'boolean') {
          break;
        }
        list.push(result);
      }
      if (index !== lg) {
        console.log(chalk.green('项目入口文件 ', chalk.red(`${newList[index]}`), ' 不存在'));
        process.exit();
      }
      return list;
    }
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

/**当时一个对象的时候*/
const checkObject = (initValue: string, initEntry: EntryObject) => {
  try {
    const enterList = Object.entries(initEntry);
    const lg = enterList.length;
    if (lg === 0) {
      const enteyFilePath = fileExists(resolveApp(`src/${initValue}.{tsx,jsx,js}`));
      if (typeof enteyFilePath === 'boolean' || !enteyFilePath) {
        console.log(chalk.green('项目入口文件 ', chalk.red(`src/${initValue}.{tsx,jsx,js}`), ' 不存在'));
        process.exit();
      }
      return enteyFilePath;
    } else {
      let index = 0;
      const newObj: EntryObject = {};
      for (index; index < lg; index++) {
        const [key, item] = enterList[index];
        if (typeof item === 'string' && item) {
          newObj[key] = checkString(initValue, item);
        } else if (Array.isArray(item) && item.length) {
          newObj[key] = checkArray(initValue, item);
        } else if (Object.prototype.toString.call(item) === '[object Object]') {
          const child = (item as EntryDescription).import;
          if (typeof child === 'string') {
            newObj[key] = {
              ...(item as EntryDescription),
              import: checkString(initValue, child),
            };
          } else if (Array.isArray(child)) {
            newObj[key] = {
              ...(item as EntryDescription),
              import: checkArray(initValue, child),
            };
          }
        }
      }
      return newObj;
    }
  } catch (err) {
    console.log(err);
    process.exit();
  }
};
