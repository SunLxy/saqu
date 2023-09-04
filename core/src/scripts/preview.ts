/**
 * 输出预览
 */
import path from 'path';
import { RspackDevServer } from '@rspack/dev-server';
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { getRspackDevServerConfig } from './../rspack.config/config/devServer';
import { SAquArgvOptions } from './../interface';

export const rspackPreview = async (argvOptions: SAquArgvOptions) => {
  try {
    /**设置环境变量值*/
    process.env.NODE_ENV = 'preview';
    /**加载自动配置*/
    const { loadConfig } = await getLoadConfig('preview', argvOptions);
    /**最终配置*/
    const lastConfig = await getRspackConfig('preview', 'client', argvOptions, loadConfig);
    /**服务配置*/
    const serverConfig = getRspackDevServerConfig(loadConfig, lastConfig.output.publicPath);
    const compiler = rspack({ entry: {} });
    const server = new RspackDevServer(
      {
        ...serverConfig,
        static: {
          directory: argvOptions.dir
            ? path.join(lastConfig.context ?? process.cwd(), argvOptions.dir)
            : lastConfig.output?.path ?? path.join(lastConfig.context ?? process.cwd(), 'dist'),
          publicPath: lastConfig.output.publicPath ?? '/',
        },
      },
      compiler as any,
    );
    /**启动服务*/
    await server.start();
  } catch (error) {
    console.error(error);
    process.exit(2);
  }
};
