/**
 * rspack plugins 配置
 */
import { RspackOptions, RspackPluginInstance, Compiler } from '@rspack/core';
import { SAquArgvOptions } from './../../interface';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export const getRspackPluginsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  argvOptions: SAquArgvOptions,
  plugins: RspackOptions['plugins'] = [],
): RspackOptions['plugins'] => {
  const newPlugins = [...plugins];
  /** 使用 webpack-bundle-analyzer */
  if (argvOptions.analyze) {
    newPlugins.push({
      name: 'rspack-bundle-analyzer',
      apply(compiler: Compiler) {
        new BundleAnalyzerPlugin({
          generateStatsFile: true,
        }).apply(compiler as any);
      },
    } as RspackPluginInstance);
  }

  return newPlugins;
};
