/**
 * 执行打包
 */
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { SAquArgvOptions } from '../interface';
export const rspackBuild = async (argvOptions: SAquArgvOptions) => {
  /**设置环境变量值*/
  process.env.NODE_ENV = 'production';
  console.time('build');
  /**加载自动配置*/
  const { loadConfig } = await getLoadConfig();
  /**最终配置*/
  const lastConfig = await getRspackConfig('production', 'client', argvOptions, loadConfig);
  const compiler = rspack(lastConfig);
  compiler.run((err, Stats) => {
    if (Stats) {
      // FS.writeFile('./a.json', JSON.stringify(Stats?.toJson(compiler.options.stats)), {
      //   flag: 'w+',
      //   encoding: 'utf-8',
      // });
    }

    if (err) {
      console.error(err);
    }
    console.timeEnd('build');
  });
};
