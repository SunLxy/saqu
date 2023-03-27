/**
 * 命令执行入口
 */
import yargsParser from 'yargs-parser';
import { SAquArgvOptions } from './../interface';

(async () => {
  try {
    const argv = yargsParser(process.argv.slice(2));
    const argvOptions: SAquArgvOptions = { ...argv };
    const scriptName = argv._[0];
    if (scriptName === 'start') {
      (await import('./start')).rspackStart(argvOptions);
    } else if (scriptName === 'build') {
      (await import('./build')).rspackBuild(argvOptions);
    }
  } catch (err) {
    console.error(err);
  }
})();
