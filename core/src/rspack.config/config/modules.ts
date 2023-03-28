/**
 * rspack modules 配置
 */
import { RspackOptions } from '@rspack/core';

export const getRspackModolesConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  module?: RspackOptions['module'],
): RspackOptions['module'] => {
  const newModules = { ...module };
  return { ...newModules };
};
