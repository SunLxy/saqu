/**
 * rspack server 配置
 */
import { DevServer } from '@rspack/core';
import { SAquConfig } from './../../interface';
import mockerApi from 'mocker-api';

export const getRspackDevServerConfig = (config: SAquConfig, publicUrlOrPath: string = '/'): DevServer => {
  const { devServer } = config;
  return {
    /**是否启用gzip压缩*/
    compress: true,
    /**是否启用热更新*/
    hot: true,
    /**启动时是否打开浏览器*/
    open: true,
    /**
     * @description 配置代理，可用于解决跨域等问题
     * @example
     * proxy: {
     *  '/api': {
     *    target: 'http://localhost:3000',
     *    changeOrigin: true,
     *  },
     * },
     * */
    proxy: config.proxy,
    ...devServer,
    /**添加响应标头*/
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      ...devServer?.headers,
    },
    /**当请求404页面时的不正当逻辑*/
    historyApiFallback: {
      disableDotRule: true,
      index: publicUrlOrPath,
    },
    client: {
      /**发生编译错误时是否在客户端屏幕上报告错误*/
      overlay: {
        errors: true,
        warnings: false,
      },
      ...(typeof devServer?.client !== 'boolean' ? devServer?.client : {}),
    },
    /**自定义中间件*/
    setupMiddlewares: (middlewares, server) => {
      /**mocker*/
      if (config.proxySetup && server.app) {
        const result = config.proxySetup(server.app);
        if (result && result.path) {
          /**设置mock*/
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
