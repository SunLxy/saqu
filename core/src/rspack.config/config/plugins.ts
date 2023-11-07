/**
 * rspack plugins 配置
 */
import {
  RspackOptions,
  RspackPluginInstance,
  Compiler,
  DefinePlugin,
  ProgressPlugin,
  HtmlRspackPlugin,
  CopyRspackPlugin,
} from '@rspack/core';
import { SAquArgvOptions } from './../../interface';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

interface OtherConfigProps {
  define?: Record<string, string>;
  otherConfig?: OtherConfigProps;
}
export const getRspackPluginsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  argvOptions: SAquArgvOptions,
  plugins: RspackOptions['plugins'] = [],
  otherConfig?: OtherConfigProps,
): RspackOptions['plugins'] => {
  const newPlugins = [
    new DefinePlugin({
      /** 解决报错: User defined `process.env.NODE_ENV` always has highest priority than default define*/
      'process.env.NODE_ENV': JSON.stringify(env),
      /**react-native 组件中使用的环境变量*/
      __DEV__: JSON.stringify(env),
      ...otherConfig?.define,
    }),
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
