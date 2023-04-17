/**
 * rspack output 配置
 */
import { RspackOptions } from '@rspack/core';
import { getPublicUrlOrPath } from '../../utils/getPublicUrlOrPath';
import { resolveApp } from './../paths';

/**对打包输出文件进行配置*/
const getFileNames = (type: 'server' | 'client', isEnvProduction: boolean) => {
  let pre = '';
  if (type === 'server') {
    pre = 'server/';
  }
  return {
    filename: isEnvProduction ? pre + 'static/js/[name].[contenthash:8].js' : pre + 'static/js/[name].js',
    chunkFilename: isEnvProduction ? pre + 'static/js/[name].[chunkhash].chunk.js' : pre + 'static/js/[name].chunk.js',
    assetModuleFilename: pre + 'static/media/[name].[hash][ext]',
    cssFilename: pre + 'static/css/[name].[contenthash:8].css',
    cssChunkFilename: pre + 'static/css/[name].[chunkhash].chunk.css',
  };
};

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
    ...output,
    ...getFileNames(type, isEnvProduction),
  };
  if (type === 'server') {
    newOutPut.library = output.library || { type: 'commonjs2' };
    newOutPut.filename = output.filename || 'server.js';
    newOutPut.path = newOutPut.path.replace(/\/$/, '') + '/server';
  }
  return { ...newOutPut };
};
