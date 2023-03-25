/**
 * rspack 执行配置
 */
import { RspackOptions } from '@rspack/core';
import { SunAquConfig } from './../interface';
export const getRspackConfig = async (
  env: 'development' | 'production',
  type: 'server' | 'client',
  loadConfigs: SunAquConfig,
) => {
  /**加载需要重写的配置*/
  const { overridesRspack, ...loadConfig } = loadConfigs;
  const initConfig: RspackOptions = {};

  /**判断是否重新配置*/
  if (overridesRspack) {
    return overridesRspack(initConfig, env, type);
  }
  return initConfig;
};
