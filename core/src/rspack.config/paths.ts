import FS from 'fs-extra';
import path from 'path';
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = FS.realpathSync(process.cwd());
export const resolveApp = (relativePath: string) => {
  console.log('relativePath', relativePath);
  return path.resolve(appDirectory, relativePath);
};
