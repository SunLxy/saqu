import load from 'carefree-proload';
import defaultConfig from './config';
import { SAquConfig, SAquArgvOptions } from './../interface';

export const getLoadConfig = async (
  env: 'development' | 'production' | 'preview',
  argvOptions: SAquArgvOptions,
): Promise<{ loadConfig: SAquConfig; filePath: string }> => {
  load.use(defaultConfig);
  const config = await load('.saqu', { mustExist: false });
  let newLoadConfig = (config || {}).raw || {};
  if (typeof newLoadConfig === 'function') {
    newLoadConfig = newLoadConfig(env, argvOptions);
  }
  return {
    loadConfig: newLoadConfig,
    filePath: (config || {}).filePath,
  };
};
