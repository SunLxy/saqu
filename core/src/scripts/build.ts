/**
 * 执行打包
 */
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
export const rspackBuild = async () => {
  console.time('build');
  /**加载自动配置*/
  const loadConfig = await getLoadConfig();
  /**最终配置*/
  const lastConfig = await getRspackConfig('production', 'client', loadConfig);
  const compiler = rspack(lastConfig);
  compiler.run((err, Stats) => {
    console.timeEnd('build');
  });
};
