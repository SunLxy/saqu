/**
 * rspack server 配置
 */
import { DevServer } from '@rspack/core';

export const getRspackDevServerConfig = (): DevServer => {
  return {
    hot: true,
    port: 3000,
  };
};
