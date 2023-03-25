/**
 * 命令执行入口
 */
import yargsParser from 'yargs-parser';

(async () => {
  const argv = yargsParser(process.argv.slice(2));
  const scriptName = argv._[0];
  if (scriptName === 'start') {
    (await import('./start')).rspackStart();
  } else if (scriptName === 'build') {
    (await import('./build')).rspackBuild();
  }
  console.log('argv', argv);
})();
