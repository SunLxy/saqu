import { SAquConfig, SAquArgvOptions } from './../interface';
import jiti from 'jiti';
import path from 'path';
import FS from 'fs-extra';

const ext = ['mjs', 'ts', 'js', 'cjs', 'mts', 'cts'];
const fileNames = ['.saqurc', '.saqu', '.saqurc.config', '.saqu.config'];

const CONFIG_FILES = fileNames.reduce((pre, next) => {
  const list = ext.map((it) => `${next}.${it}`);
  return list;
}, []);

const resolveConfigPath = (root: string = process.cwd()) => {
  for (const file of CONFIG_FILES) {
    const configFile = path.join(root, file);
    if (FS.existsSync(configFile)) {
      return configFile;
    }
  }
  return null;
};

export const getLoadConfig = async (
  env: 'development' | 'production' | 'preview',
  argvOptions: SAquArgvOptions,
): Promise<{ loadConfig: SAquConfig; filePath: string }> => {
  let loadConfig = {};
  const filePath = resolveConfigPath();
  if (filePath) {
    try {
      const load = jiti(__filename, {
        fsCache: false,
        moduleCache: false,
        interopDefault: true,
      });
      loadConfig = load(filePath);
      if (typeof loadConfig === 'function') {
        loadConfig = loadConfig(env, argvOptions);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return {
    loadConfig,
    filePath,
  };
};
