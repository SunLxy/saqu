/**
 * 执行打包
 */
import { getLoadConfig } from './../config';
import { getRspackConfig } from './../rspack.config';
import { rspack } from '@rspack/core';
import { SAquArgvOptions } from '../interface';
import FS from 'fs-extra';
import path from 'path';
/**
 * @description 执行打包
 */
export const rspackBuild = async (argvOptions: SAquArgvOptions) => {
  /**设置环境变量值*/
  process.env.NODE_ENV = 'production';
  console.time('build');
  /**加载自动配置*/
  const { loadConfig } = await getLoadConfig('production', argvOptions);
  /**最终配置*/
  const lastConfig = await getRspackConfig('production', 'client', argvOptions, loadConfig);
  /**置空输出文件夹*/
  FS.emptyDirSync(lastConfig.output.path);
  const compiler = rspack(lastConfig);
  compiler.run((err, Stats) => {
    if (err) {
      console.error(err);
    } else if (Stats) {
      const statsFieldName = path.join(lastConfig.output.path, 'stats.json');
      FS.writeFileSync(statsFieldName, JSON.stringify(Stats.toJson({ all: false, assets: true })), {
        flag: 'w+',
        encoding: 'utf-8',
      });
      console.log(
        Stats.toString({
          all: false,
          assets: true,
          colors: true,
        }),
      );
    }
    console.timeEnd('build');
  });
};
