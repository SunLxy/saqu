import minimatch from 'minimatch';
import FS from 'fs-extra';
import path from 'path';
import { IgnoreFunction } from './interface';

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
) => {
  const newRoot = root || currentPath;
  const list = FS.readdirSync(currentPath, { encoding: 'utf-8' });
  // 1. 文件夹
  const dirList: any[] = [];
  // 2. 文件
  const fileList: string[] = [];
  const lg = list.length;
  for (let i = 0; i < lg; i++) {
    const filename = list[i];
    // 把Windows的 \ 替换成 /
    const filedir = path.join(currentPath, filename).replace(path.sep, '/');
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
          const result = recursiveReaddir(filedir, matchIgnores, fileExt, newRoot);
          dirList.push({ path: filename, children: result });
        }
        if (isFile) {
          const rgx = new RegExp(`index.(${fileExt})$`);
          if (rgx.test(filename)) fileList.push(exFilePath);
        }
      }
    }
  }
  return { fileList, dirList };
};
