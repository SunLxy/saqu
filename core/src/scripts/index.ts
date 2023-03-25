/**
 * 命令执行入口
 */
import yargsParser from 'yargs-parser';
(async () => {
  const argv = yargsParser(process.argv.slice(2));
})();
