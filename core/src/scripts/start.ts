/**
 * 执行开发
 */
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
export const rspackStart = async () => {
  console.time('start');
  /**加载自动配置*/
  const loadConfig = await getLoadConfig();
  /**最终配置*/
  const lastConfig = await getRspackConfig('development', 'client', loadConfig);
  const compiler = rspack(lastConfig);
  compiler.run((err, Stats) => {
    console.timeEnd('start');
  });
};
