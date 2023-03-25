import load from 'carefree-proload';
import defaultConfig from './config';
import { SunAquConfig } from './../interface';

export const getLoadConfig = async (): Promise<SunAquConfig> => {
  load.use(defaultConfig);
  const config = await load('.sunaqu', { mustExist: false });
  return (config || {}).raw || {};
};
