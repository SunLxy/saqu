/**
 * rspack 执行配置
 */
import { RspackOptions, ExternalItem } from '@rspack/core';
import nodeExternals from 'webpack-node-externals';
import { SAquConfig, SAquArgvOptions } from './../interface';
import { getRspackEntryConfig } from './config/entry';
import { getRspackBuiltinsConfig } from './config/builtins';
import { getRspackOutputConfig } from './config/output';
import { getRspackModolesConfig } from './config/modules';
import { getRspackPluginsConfig } from './config/plugins';
import { getRspackResolveConfig } from './config/resolve';

export const getRspackConfig = async (
  env: 'development' | 'production',
  type: 'server' | 'client',
  argvOptions: SAquArgvOptions,
  loadConfigs: SAquConfig,
) => {
  /**加载需要重写的配置*/
  const { overridesRspack, proxy, proxySetup, ...rest } = loadConfigs;
  const loadConfig = { ...rest, proxy, proxySetup };
  /**是否是生产*/
  const isEnvProduction = env === 'production';
  const initConfig: RspackOptions = {
    ...rest,
    target: type === 'client' ? 'web' : 'node',
    mode: env,
    stats: {
      preset: 'errors-warnings',
      colors: true,
      ...(typeof loadConfig.stats === 'object' ? { ...loadConfig.stats } : {}),
    },
    optimization: {
      minimize: isEnvProduction,
    },
    devtool: isEnvProduction ? false : 'cheap-module-source-map',
    entry: getRspackEntryConfig(env, type, loadConfig.entry),
    builtins: getRspackBuiltinsConfig(env, type, loadConfig.builtins),
    output: getRspackOutputConfig(env, type, loadConfig.output),
    module: getRspackModolesConfig(env, type, loadConfig.module),
    plugins: getRspackPluginsConfig(env, type, argvOptions, loadConfig.plugins),
    resolve: getRspackResolveConfig(env, type, loadConfig.resolve),
  };
  if (type === 'server') {
    initConfig.externals = loadConfig.externals || [nodeExternals() as ExternalItem];
  }
  /**判断是否重新配置*/
  if (overridesRspack) {
    return overridesRspack(initConfig, env, argvOptions, type);
  }
  return initConfig;
};
