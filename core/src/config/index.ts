import load from 'carefree-proload';
import defaultConfig from './config';
import { SAquConfig } from './../interface';

export const getLoadConfig = async (): Promise<SAquConfig> => {
  load.use(defaultConfig);
  const config = await load('.saqu', { mustExist: false });
  return (config || {}).raw || {};
};
