/**
 * 执行开发
 */
import { RspackDevServer } from '@rspack/dev-server';
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { getRspackDevServerConfig } from './../rspack.config/config/devServer';
import chokidar from 'chokidar';
import { SAquConfig } from './../interface';
export const rspackStart = async () => {
  try {
    process.env.NODE_ENV = 'development';
    let server: RspackDevServer;
    /**加载自动配置*/
    const { loadConfig, filePath } = await getLoadConfig();
    const rspackRun = async (config: SAquConfig) => {
      /**最终配置*/
      const lastConfig = await getRspackConfig('development', 'client', config);
      const serverConfig = getRspackDevServerConfig(config);
      if (server) {
        await server.stop();
        serverConfig.open = false;
      }
      const compiler = rspack(lastConfig);
      server = new RspackDevServer(serverConfig, compiler);
      await server.start();
    };
    rspackRun(loadConfig);
    if (filePath) {
      chokidar.watch(filePath).on('change', async () => {
        /**清除缓存，防止读取老的文件内容*/
        delete require.cache[require.resolve(filePath)];
        const result = await getLoadConfig();
        rspackRun(result.loadConfig);
      });
    }
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
};
