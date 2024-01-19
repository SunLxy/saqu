import { Builtins } from '@rspack/core';

export const getRspackBuiltinsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  builtins?: Builtins,
): Builtins => {
  const newBuiltins: Builtins = builtins || {};
  const { define, ...rest } = newBuiltins;
  // /**是否是开发环境*/
  // const isEnvDevelopment = env === 'development';
  // const isEnvProduction = env === 'production';
  return {
    ...rest,
    /**进度条设置*/
    // progress: true,
    /**设置内置的最小化选项*/
    // minifyOptions: {
    //   /**
    //    * @description 传递true以丢弃对控制台的调用。console.* functions。
    //    * 默认生产去除 log 打印
    //    */
    //   dropConsole: isEnvProduction,
    //   ...newBuiltins?.minifyOptions,
    // },
    /**控制关于react的代码转换*/
    react: {
      // 这个添加 false 解决控制台 $refreshSig$ 报错
      refresh: false,
      ...newBuiltins?.react,
    },
  };
};
