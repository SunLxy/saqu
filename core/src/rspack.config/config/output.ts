/**
 * rspack output 配置
 */
import { RspackOptions } from '@rspack/core';
import { getPublicUrlOrPath } from '../../utils/getPublicUrlOrPath';
import { resolveApp } from './../paths';

export const getRspackOutputConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  output?: RspackOptions['output'],
): RspackOptions['output'] => {
  /**是否是生产*/
  const isEnvProduction = env === 'production';
  const isEnvDevelopment = env === 'development';
  /**设置 publicPath 值*/
  const publicPath = getPublicUrlOrPath(
    isEnvDevelopment,
    require(resolveApp('package.json')).homepage,
    output?.publicPath || process.env.PUBLIC_URL,
  );

  const newOutPut: RspackOptions['output'] = {
    path: 'dist',
    publicPath: publicPath,
    filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js',
    chunkFilename: isEnvProduction ? 'static/js/[name].[chunkhash].chunk.js' : 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
    cssFilename: 'static/css/[name].[contenthash:8].css',
    cssChunkFilename: 'static/css/[name].[chunkhash].chunk.css',
    ...output,
  };
  if (type === 'server') {
    newOutPut.library = output.library || { type: 'commonjs2' };
    newOutPut.filename = output.filename || 'server.js';
    newOutPut.path = (output?.path || 'dist').replace(/\/$/, '') + '/server';
  } else {
    newOutPut.path = output?.path || 'dist';
  }
  return { ...newOutPut };
};
