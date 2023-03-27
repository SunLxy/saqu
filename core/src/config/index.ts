import load from 'carefree-proload';
import defaultConfig from './config';
import { SAquConfig } from './../interface';
export const getLoadConfig = async (): Promise<{ loadConfig: SAquConfig; filePath: string }> => {
  load.use(defaultConfig);
  const config = await load('.saqu', { mustExist: false });
  return {
    loadConfig: (config || {}).raw || {},
    filePath: (config || {}).filePath,
  };
};
