/**
 * 执行开发
 */
import { RspackDevServer } from '@rspack/dev-server';
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { getRspackDevServerConfig } from './../rspack.config/config/devServer';
import chokidar from 'chokidar';
import { SAquConfig, SAquArgvOptions } from './../interface';
export const rspackStart = async (argvOptions: SAquArgvOptions) => {
  try {
    /**设置环境变量值*/
    process.env.NODE_ENV = 'development';

    let server: RspackDevServer;
    /**加载自动配置*/
    const { loadConfig, filePath } = await getLoadConfig();
    const rspackRun = async (config: SAquConfig) => {
      /**最终配置*/
      const lastConfig = await getRspackConfig('development', 'client', argvOptions, config);
      /**服务配置*/
      const serverConfig = getRspackDevServerConfig(config);
      if (server) {
        /**执行服务停止*/
        await server.stop();
        /**不打开新的窗口*/
        serverConfig.open = false;
      }
      const compiler = rspack({ ...lastConfig, devServer: serverConfig });
      server = new RspackDevServer(serverConfig, compiler);
      /**启动服务*/
      await server.start();
    };
    let watch: chokidar.FSWatcher;
    const loopWatch = (filePath: string, loadConfig: SAquConfig, preFilePath?: string) => {
      rspackRun(loadConfig);
      if (watch) {
        watch.unwatch(preFilePath || filePath);
      }
      if (filePath) {
        /**监听配置变化重新执行命令*/
        watch = chokidar.watch(filePath);
        watch.on('change', async () => {
          /**清除缓存，防止读取老的文件内容*/
          delete require.cache[require.resolve(filePath)];
          const result = await getLoadConfig();
          if (result.filePath !== filePath) {
            loopWatch(result.filePath, result.loadConfig, filePath);
          } else {
            rspackRun(result.loadConfig);
          }
        });
      }
    };
    loopWatch(filePath, loadConfig);
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
};
