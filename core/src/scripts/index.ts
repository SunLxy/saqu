/**
 * 命令执行入口
 */
import yargsParser from 'yargs-parser';
import { SAquArgvOptions } from './../interface';
import { help } from './../utils/help';

(async () => {
  try {
    /**解析命令*/
    const argv = yargsParser(process.argv.slice(2));
    /**命令参数*/
    const argvOptions: SAquArgvOptions = { ...argv };
    if (argvOptions.h || argvOptions.help) {
      return help();
    }
    /**获取第一个参数值*/
    const scriptName = argv._[0];
    /**判断执行开发*/
    if (scriptName === 'start') {
      (await import('./start')).rspackStart(argvOptions);
    } else if (scriptName === 'build') {
      /**判断执行打包*/
      (await import('./build')).rspackBuild(argvOptions);
    } else if (scriptName === 'preview') {
      /**判断执行打包*/
      (await import('./preview')).rspackPreview(argvOptions);
    }
  } catch (err) {
    console.error(err);
  }
})();
