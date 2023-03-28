/***
 *  使用的依赖包
 *  "strip-ansi": "~6.0.1",
 *  "gzip-size": "~6.0.0",
 *  "filesize": "~9.0.11"
 *  "fs-extra": "~11.1.0",
 *  "chalk": "4.1.2",
 * */

// import stripAnsi from 'strip-ansi';
// import gzipSize from 'gzip-size';
// import filesize from 'filesize';
// import chalk from 'chalk';
// import path from 'path';
// import fs from 'fs-extra';
// import { Stats } from '@rspack/core';

// const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
// const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

// function canReadAsset(asset: string) {
//   return (
//     /\.(js|css)$/.test(asset) && !/service-worker\.js/.test(asset) && !/precache-manifest\.[0-9a-f]+\.js/.test(asset)
//   );
// }

// interface ItemType {
//   folder: string;
//   name: string;
//   size: number;
//   sizeLabel: string;
// }

// export const printFileSizes = async (
//   stats: Stats | Stats[],
//   buildPath: string,
//   maxBundleGzipSize: number = WARN_AFTER_BUNDLE_GZIP_SIZE,
//   maxChunkGzipSize: number = WARN_AFTER_CHUNK_GZIP_SIZE,
// ) => {
//   const newStatsDataLists = Array.isArray(stats) ? stats : [stats];
//   const statsListLength = newStatsDataLists.length;
//   const newStatsList: ItemType[] = [];
//   /**循环数据*/
//   for (let index = 0; index < statsListLength; index++) {
//     const element = newStatsDataLists[index];
//     /**转换成 json*/
//     const newData = element.toJson({ all: false, assets: true }).assets.filter((asset) => canReadAsset(asset.name));
//     const lg = newData.length;
//     /**循环每一项资源*/
//     for (let j = 0; j < lg; j++) {
//       const asset = newData[j];
//       /**读取文件内容*/
//       const fileContents = fs.readFileSync(path.join(buildPath, asset.name));
//       /**对文件内容进行压缩大小*/
//       const size = await gzipSize(fileContents);
//       const newItem = {
//         folder: path.join(path.basename(buildPath), path.dirname(asset.name)),
//         name: path.basename(asset.name),
//         size: size,
//         sizeLabel: '' + filesize(size),
//       };
//       newStatsList.push(newItem);
//     }
//   }
//   newStatsList.sort((a, b) => b.size - a.size);
//   const longestSizeLabelLength = Math.max.apply(
//     null,
//     newStatsList.map((a) => stripAnsi(a.sizeLabel).length),
//   );
//   newStatsList.forEach((asset) => {
//     let sizeLabel = asset.sizeLabel;
//     const sizeLength = stripAnsi(sizeLabel).length;
//     if (sizeLength < longestSizeLabelLength) {
//       const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
//       sizeLabel += rightPadding;
//     }
//     const isMainBundle = asset.name.indexOf('main.') === 0;
//     const maxRecommendedSize = isMainBundle ? maxBundleGzipSize : maxChunkGzipSize;
//     const isLarge = maxRecommendedSize && asset.size > maxRecommendedSize;
//     console.log(
//       '  ' +
//         (isLarge ? chalk.yellow(sizeLabel) : sizeLabel) +
//         '  ' +
//         chalk.dim(asset.folder + path.sep) +
//         chalk.cyan(asset.name),
//     );
//   });
// };
