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
    /**输出文件名称*/
    filename: isEnvProduction ? pre + 'static/js/[name].[contenthash:8].js' : pre + 'static/js/[name].js',
    /**分割代码输出文件名*/
    chunkFilename: isEnvProduction ? pre + 'static/js/[name].[chunkhash].chunk.js' : pre + 'static/js/[name].chunk.js',
    /**资源文件名称*/
    assetModuleFilename: pre + 'static/media/[name].[hash][ext]',
    /**css 文件输出文件名称*/
    cssFilename: pre + 'static/css/[name].[contenthash:8].css',
    /**css 分割文件输出文件名称*/
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
  /**是否是开发环境*/
  const isEnvDevelopment = env === 'development';

  const newOutPut: RspackOptions['output'] = {
    /**默认输出文件夹地址*/
    path: 'dist',
    // /**引用资源的URL前缀*/
    // publicPath: publicPath,
    /**在生成产物前，删除输出目录下的所有文件。*/
    clean: true,
    ...output,
    ...getFileNames(type, isEnvProduction),
  };
  if (type === 'server') {
    /**输出一个库，公开入口点的导出*/
    newOutPut.library = output.library || { type: 'commonjs2' };
    /**输出文件名称*/
    newOutPut.filename = output.filename || 'server.js';
    /**输出地址*/
    newOutPut.path = newOutPut.path.replace(/\/$/, '') + '/server';
  }
  /**设置 publicPath 值*/
  const publicPath =
    output?.publicPath ||
    getPublicUrlOrPath(isEnvDevelopment, require(resolveApp('package.json')).homepage, process.env.PUBLIC_URL);

  if (isEnvProduction) {
    newOutPut.publicPath = publicPath;
  } else {
    newOutPut.publicPath = getPublicUrlOrPath(
      isEnvDevelopment,
      require(resolveApp('package.json')).homepage,
      process.env.PUBLIC_URL,
    );
  }

  return { ...newOutPut };
};
