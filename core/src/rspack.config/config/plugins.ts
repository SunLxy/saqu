/**
 * rspack plugins 配置
 */
import { RspackOptions } from '@rspack/core';

export const getRspackPluginsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  plugins?: RspackOptions['plugins'],
): RspackOptions['plugins'] => {
  return [];
};
