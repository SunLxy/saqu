/**
 * 执行打包
 */
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { SAquArgvOptions } from '../interface';
import { printFileSizes } from './../utils';
import FS from 'fs-extra';
export const rspackBuild = async (argvOptions: SAquArgvOptions) => {
  /**设置环境变量值*/
  process.env.NODE_ENV = 'production';
  console.time('build');
  /**加载自动配置*/
  const { loadConfig } = await getLoadConfig();
  /**最终配置*/
  const lastConfig = await getRspackConfig('production', 'client', argvOptions, loadConfig);
  /**置空输出文件夹*/
  if (lastConfig.output.path) {
    FS.emptyDirSync(lastConfig.output.path);
  }
  const compiler = rspack(lastConfig);
  compiler.run((err, Stats) => {
    if (Stats) {
      const newStats = Array.isArray(compiler.options) ? (Stats as any).children : Stats;
      printFileSizes(newStats, lastConfig.output.path);
    }
    if (err) {
      console.error(err);
    }
    console.timeEnd('build');
  });
};
