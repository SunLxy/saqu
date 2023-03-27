/**
 * 执行开发
 */
import { RspackDevServer } from '@rspack/dev-server';
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { getRspackDevServerConfig } from './../rspack.config/config/devServer';
// import chokidar from 'chokidar';
// import { SAquConfig } from './../interface';
export const rspackStart = async () => {
  try {
    process.env.NODE_ENV = 'development';
    let server: RspackDevServer;
    /**加载自动配置*/
    const { loadConfig, filePath } = await getLoadConfig();
    /**最终配置*/
    const lastConfig = await getRspackConfig('development', 'client', loadConfig);
    const serverConfig = getRspackDevServerConfig(loadConfig);
    const compiler = rspack(lastConfig);
    server = new RspackDevServer(serverConfig, compiler);
    await server.start();
    // const rspackRun = async (config: SAquConfig) => {
    //   /**最终配置*/
    //   const lastConfig = await getRspackConfig('development', 'client', config);
    //   const serverConfig = getRspackDevServerConfig(config);
    //   if (server) {
    //     await server.stop();
    //     serverConfig.open = false;
    //   }
    //   const compiler = rspack(lastConfig);
    //   server = new RspackDevServer(serverConfig, compiler);
    //   await server.start();
    // };
    // // rspackRun(loadConfig);
    // // if (filePath) {
    // const getConfig = async () => {
    //   const result = await getLoadConfig();
    //   console.log('result', result.loadConfig);
    //   rspackRun(result.loadConfig);
    // };

    // chokidar.watch('/Users/lusun/Carefree/saqu/website/.saqurc.ts').on('all', getConfig);
    // }
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
};
