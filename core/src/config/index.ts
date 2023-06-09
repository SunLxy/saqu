import load from 'carefree-proload';
import defaultConfig from './config';
import { SAquConfig, SAquArgvOptions } from './../interface';

export const getLoadConfig = async (
  env: 'development' | 'production',
  argvOptions: SAquArgvOptions,
): Promise<{ loadConfig: SAquConfig; filePath: string }> => {
  const temp = process.env.SWCRC;
  /**为了控制 @swc-node/register 读取默认配置不走传递的配置 */
  process.env.SWCRC = 'true';
  load.use(defaultConfig);
  const config = await load('.saqu', { mustExist: false });
  /**还原参数值*/
  process.env.SWCRC = temp;
  let newLoadConfig = (config || {}).raw || {};
  if (typeof newLoadConfig === 'function') {
    newLoadConfig = newLoadConfig(env, argvOptions);
  }
  return {
    loadConfig: newLoadConfig,
    filePath: (config || {}).filePath,
  };
};
