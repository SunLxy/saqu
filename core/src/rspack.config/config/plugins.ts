/**
 * rspack plugins 配置
 */
import type { SwcJsMinimizerRspackPluginOptions, RspackOptions, RspackPluginInstance, Compiler } from '@rspack/core';
import {
  DefinePlugin,
  ProgressPlugin,
  HtmlRspackPlugin,
  CopyRspackPlugin,
  SwcJsMinimizerRspackPlugin,
} from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { SAquArgvOptions } from './../../interface';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

interface BuiltinsReplaceConfigProps {
  define?: Record<string, string>;
  _JS_minifyOptions?: SwcJsMinimizerRspackPluginOptions;
}
export const getRspackPluginsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  argvOptions: SAquArgvOptions,
  plugins: RspackOptions['plugins'] = [],
  builtinsReplaceConfig?: BuiltinsReplaceConfigProps,
): RspackOptions['plugins'] => {
  /**是否是开发环境*/
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';

  const newPlugins = [
    isEnvDevelopment && new ReactRefreshPlugin(),
    new DefinePlugin({
      /** 解决报错: User defined `process.env.NODE_ENV` always has highest priority than default define*/
      'process.env.NODE_ENV': JSON.stringify(env),
      /**react-native 组件中使用的环境变量*/
      __DEV__: JSON.stringify(env),
      ...builtinsReplaceConfig?.define,
    }),
    new SwcJsMinimizerRspackPlugin({ dropConsole: isEnvProduction, ...builtinsReplaceConfig._JS_minifyOptions }),
    /**进度条*/
    new ProgressPlugin(),
    /**此配置简化了HTML文件的创建*/
    new HtmlRspackPlugin({ template: './public/index.html' }),
    /**将已存在的单个文件或整个目录复制到生成目录*/
    new CopyRspackPlugin({
      patterns: [
        /**把项目根目录的 public 目录下的所有内容进行拷贝*/
        {
          from: 'public',
          globOptions: {
            /**忽略 index.html文件*/
            ignore: ['**/index.html'],
          },
        },
      ],
    }),
    ...plugins,
  ];
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
