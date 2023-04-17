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

  // 输出配置
  const output = getRspackOutputConfig(env, type, loadConfig.output);

  /**额外 define 参数*/
  const otherDefine = {
    'process.env.PUBLIC_URL': JSON.stringify(output.publicPath.slice(0, -1)),
  };

  // 配置
  const initConfig: RspackOptions = {
    ...rest,
    target: type === 'client' ? 'web' : 'node',
    mode: env,
    stats: {
      preset: 'errors-warnings',
      colors: true,
      ...(typeof loadConfig.stats === 'object' ? { ...loadConfig.stats } : {}),
    },
    output,
    optimization: { minimize: isEnvProduction },
    devtool: isEnvProduction ? false : 'cheap-module-source-map',
    entry: getRspackEntryConfig(env, type, loadConfig.entry),
    builtins: getRspackBuiltinsConfig(env, type, loadConfig.builtins, { define: otherDefine }),
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
