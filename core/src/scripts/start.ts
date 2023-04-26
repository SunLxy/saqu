import { RspackDevServer } from '@rspack/dev-server';
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { getRspackDevServerConfig } from './../rspack.config/config/devServer';
import chokidar from 'chokidar';
import { SAquConfig, SAquArgvOptions } from './../interface';
/**
 * @description 执行开发
 */
export const rspackStart = async (argvOptions: SAquArgvOptions) => {
  try {
    /**设置环境变量值*/
    process.env.NODE_ENV = 'development';

    let server: RspackDevServer;
    /**加载自动配置*/
    const { loadConfig, filePath } = await getLoadConfig('development', argvOptions);

    const rspackRun = async (config: SAquConfig) => {
      /**最终配置*/
      const lastConfig = await getRspackConfig('development', 'client', argvOptions, config);
      /**服务配置*/
      const serverConfig = getRspackDevServerConfig(config, lastConfig.output.publicPath);
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
    // 用于变更配置文件路径变更处理配置监听
    const loopWatch = (filePath: string, loadConfig: SAquConfig, preFilePath?: string) => {
      rspackRun(loadConfig);
      if (watch) {
        // 先卸载文件监听
        watch.unwatch(preFilePath || filePath);
      }
      // 判断是否存在文件地址
      if (filePath) {
        /**监听配置变化重新执行命令*/
        watch = chokidar.watch(filePath);
        const watchConfig = async () => {
          /**清除缓存，防止读取老的文件内容*/
          delete require.cache[require.resolve(filePath)];
          const result = await getLoadConfig('development', argvOptions);
          if (result.filePath !== filePath) {
            loopWatch(result.filePath, result.loadConfig, filePath);
          } else {
            rspackRun(result.loadConfig);
          }
        };
        watch.on('unlink', watchConfig);
        watch.on('change', watchConfig);
      }
    };
    loopWatch(filePath, loadConfig);
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
};
