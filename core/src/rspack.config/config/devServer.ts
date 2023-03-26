/**
 * rspack server 配置
 */
import { DevServer } from '@rspack/core';
import { SAquConfig } from './../../interface';
import mockerApi from 'mocker-api';

export const getRspackDevServerConfig = (config: SAquConfig): DevServer => {
  const { devServer } = config;
  return {
    compress: true,
    hot: true,
    ...devServer,
    // open: devServer?.open || true,
    proxy: devServer?.proxy || config.proxy,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      ...devServer?.headers,
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
      ...(typeof devServer?.client !== 'boolean' ? devServer?.client : {}),
    },
    setupMiddlewares: (middlewares, server) => {
      /**mocker*/
      if (config.proxySetup && server.app) {
        const result = config.proxySetup(server.app);
        if (result && result.path) {
          mockerApi(server.app, result.path, { ...result.options });
        }
      }
      if (devServer && devServer.setupMiddlewares) {
        return devServer.setupMiddlewares(middlewares, server);
      }
      return middlewares;
    },
  };
};
