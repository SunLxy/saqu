/**
 * rspack output 配置
 */
import { RspackOptions } from '@rspack/core';

export const getRspackOutputConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  output?: RspackOptions['output'],
): RspackOptions['output'] => {
  /**是否是生产*/
  const isEnvProduction = env === 'production';
  const newOutPut: RspackOptions['output'] = { ...output };
  if (type === 'server') {
    newOutPut.library = output.library || { type: 'commonjs2' };
    newOutPut.filename = output.filename || 'server.js';
    newOutPut.path = (output.path || 'dist').replace(/\/$/, '') + '/server';
  }
  return { ...newOutPut };
};
