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
    cache: true,
    ...rest,
    /**用于配置Rspack输出的目标环境和Rspack运行时代码的ECMAScript版本*/
    target: type === 'client' ? 'web' : 'node',
    /**mode配置用于设置Rspack的构建模式以启用默认优化策略*/
    mode: env,
    /**生成可用于分析模块依赖项和优化编译速度的打包信息*/
    stats: {
      /***/
      preset: 'errors-warnings',
      colors: true,
      ...(typeof loadConfig.stats === 'object' ? { ...loadConfig.stats } : {}),
    },
    /**用于指示Rspack如何以及在何处输出生成文件的内容*/
    output,
    /**Rspack 会根据mode. 您还可以通过自定义配置optimization。*/
    optimization: { minimize: isEnvProduction },
    /**devtool配置用于控制源映射生成的行为*/
    devtool: isEnvProduction ? false : 'cheap-module-source-map',
    /**entry配置用于设置Rspack构建的入口模块。*/
    entry: getRspackEntryConfig(env, type, loadConfig.entry),
    /**用于设置Rspack提供的内置函数*/
    builtins: getRspackBuiltinsConfig(env, type, loadConfig.builtins, { define: otherDefine }),
    /**用于决定如何处理项目中不同类型的模块。*/
    module: getRspackModolesConfig(env, type, loadConfig.module),
    /**自定义生成过程*/
    plugins: getRspackPluginsConfig(env, type, argvOptions, loadConfig.plugins),
    /**用于配置Rspack模块解析逻辑*/
    resolve: getRspackResolveConfig(env, type, loadConfig.resolve),
  };
  if (type === 'server') {
    /**
     * externals配置选项提供了一种从输出包中排除依赖项的方法。
     * 相反，所创建的捆绑包依赖于在消费者（任何最终用户应用程序）的环境中存在的依赖性。
     * 此功能通常对库开发人员最有用，但是有各种各样的应用程序。
     * */
    initConfig.externals = loadConfig.externals || [nodeExternals() as ExternalItem];
  }
  /**判断是否重新配置*/
  if (overridesRspack) {
    return overridesRspack(initConfig, env, argvOptions, type);
  }
  return initConfig;
};
