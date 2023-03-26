/**
 * rspack 执行配置
 */
import { RspackOptions } from '@rspack/core';
import { SunAquConfig } from './../interface';
import { getRspackEntryConfig } from './config/entry';
import { getRspackBuiltinsConfig } from './config/builtins';
import { getRspackOutputConfig } from './config/output';
import { getRspackModolesConfig } from './config/modules';
export const getRspackConfig = async (
  env: 'development' | 'production',
  type: 'server' | 'client',
  loadConfigs: SunAquConfig,
) => {
  /**加载需要重写的配置*/
  const { overridesRspack, ...loadConfig } = loadConfigs;
  /**是否是生产*/
  const isEnvProduction = env === 'production';

  const initConfig: RspackOptions = {
    target: type === 'client' ? 'browserslist' : 'node',
    mode: env,
    devtool: isEnvProduction ? false : 'cheap-module-source-map',
    entry: getRspackEntryConfig(env, type, loadConfig.entry),
    builtins: getRspackBuiltinsConfig(env, type, loadConfig.builtins),
    output: getRspackOutputConfig(env, type, loadConfig.output),
    module: getRspackModolesConfig(env, type, loadConfig.module),
  };
  /**判断是否重新配置*/
  if (overridesRspack) {
    return overridesRspack(initConfig, env, type);
  }
  return initConfig;
};
