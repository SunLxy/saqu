import { RspackOptions } from '@rspack/core';

export interface SunAquConfig extends RspackOptions {
  /**重写环境配置*/
  overridesRspack?: (
    config: RspackOptions,
    env: 'development' | 'production',
    type: 'server' | 'client',
  ) => Promise<RspackOptions> | RspackOptions;
}
