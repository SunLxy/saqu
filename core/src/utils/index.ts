import fs from 'node:fs';
export * from './overridesInterface';
// export * from './printFileSizes';
/**
 * @description 如果存在返回匹配的 URL
 */
export function fileExists(fileName: string = ''): string | boolean {
  const [matchStr, extnames] = fileName.match(/{(.*?)}$/) || [];
  let result: boolean | string = false;
  if (matchStr) {
    extnames?.split(',').forEach((name) => {
      const filePath = fileName.replace(matchStr, name);
      if (fs.existsSync(filePath)) {
        result = filePath;
      }
    });
  }
  return result;
}
