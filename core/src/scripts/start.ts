/**
 * 执行开发
 */
import { RspackDevServer } from '@rspack/dev-server';
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { getRspackDevServerConfig } from './../rspack.config/devServer';
export const rspackStart = async () => {
  try {
    process.env.NODE_ENV = 'development';
    /**加载自动配置*/
    const loadConfig = await getLoadConfig();
    /**最终配置*/
    const lastConfig = await getRspackConfig('development', 'client', loadConfig);

    const compiler = rspack(lastConfig);

    const server = new RspackDevServer(getRspackDevServerConfig(), compiler);
    await server.start();
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
};
