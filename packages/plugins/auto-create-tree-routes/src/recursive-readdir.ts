import minimatch from 'minimatch';
import FS from 'fs-extra';
import path from 'path';
import { IgnoreFunction, TreeObjectDataType } from './interface';

const patternMatcher = (pattern: string) => {
  return (path: string, stats: FS.Stats) => {
    const minimatcher = new minimatch.Minimatch(pattern, { matchBase: true });
    return (!minimatcher.negate || stats.isFile()) && minimatcher.match(path);
  };
};

export const toMatcherFunction = (ignoreEntry: string | IgnoreFunction) => {
  if (typeof ignoreEntry == 'function') {
    return ignoreEntry;
  } else {
    return patternMatcher(ignoreEntry);
  }
};

// 根据路径进行递归解析文件
export const recursiveReaddir = (
  currentPath: string,
  matchIgnores: IgnoreFunction[] = [],
  fileExt: string = '',
  root?: string,
  mapPaths: Map<string, boolean> = new Map([]),
): TreeObjectDataType => {
  const newRoot = root || currentPath;
  const list = FS.readdirSync(currentPath, { encoding: 'utf-8' });
  // 1. 文件夹
  const objPathData: any = {};
  // 2. index 入口文件
  let indexFile: string;
  const lg = list.length;
  for (let i = 0; i < lg; i++) {
    const filename = list[i];
    // 把Windows的 \ 替换成 /
    const filedir = path.join(currentPath, filename).replace(/\\/g, '/');
    const isNoEmty = FS.existsSync(filedir);
    if (!isNoEmty) {
      return;
    }
    const stats = FS.statSync(filedir);
    if (stats) {
      const exFilePath = filedir.replace(newRoot, '');
      const isFile = stats.isFile(); //是文件
      const isDir = stats.isDirectory(); //是文件夹
      const isNotNext = matchIgnores.some(function (matcher) {
        return matcher(exFilePath, stats);
      });
      if (!isNotNext) {
        if (isDir) {
          const result = recursiveReaddir(filedir, matchIgnores, fileExt, newRoot, mapPaths);
          if (Object.keys(result).length) {
            objPathData[filename] = result;
          }
        }
        if (isFile) {
          const rgx = new RegExp(`^index.(${fileExt})$`);
          if (rgx.test(filename)) {
            indexFile = exFilePath;
            mapPaths.set(filedir, true);
          }
        }
      }
    }
  }
  if (indexFile) {
    objPathData.index = indexFile;
  }
  return { ...objPathData };
};
