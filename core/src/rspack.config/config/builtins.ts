import { Builtins } from '@rspack/core';

interface OtherConfigProps {
  define?: Record<string, string>;
}

export const getRspackBuiltinsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  builtins?: Builtins,
  otherConfig?: OtherConfigProps,
): Builtins => {
  const newBuiltins: Builtins = builtins || {};
  /**是否是开发环境*/
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  return {
    ...newBuiltins,
    /**进度条设置*/
    progress: true,
    /**设置内置的最小化选项*/
    minifyOptions: {
      /**
       * @description 传递true以丢弃对控制台的调用。console.* functions。
       * 默认生产去除 log 打印
       */
      dropConsole: isEnvProduction,
      ...newBuiltins?.minifyOptions,
    },
    /**控制关于react的代码转换*/
    react: {
      // 这个添加 false 解决控制台 $refreshSig$ 报错
      refresh: false,
      ...newBuiltins?.react,
    },
    /**在编译时将代码中的变量替换为其他值或表达式*/
    define: {
      /** 解决报错: User defined `process.env.NODE_ENV` always has highest priority than default define*/
      'process.env.NODE_ENV': JSON.stringify(env),
      /**react-native 组件中使用的环境变量*/
      __DEV__: JSON.stringify(env),
      ...otherConfig?.define,
      ...newBuiltins?.define,
    },
    /**将已存在的单个文件或整个目录复制到生成目录*/
    copy: {
      ...newBuiltins?.copy,
      patterns: [
        /**把项目根目录的 public 目录下的所有内容进行拷贝*/
        {
          from: 'public',
          globOptions: {
            /**忽略 index.html文件*/
            ignore: ['**/index.html'],
          },
        },
        ...(newBuiltins?.copy?.patterns || []),
      ] as Builtins['copy']['patterns'],
    },
    /**此配置简化了HTML文件的创建*/
    html: [
      ...(newBuiltins?.html || [
        /**渲染模板*/
        {
          template: './public/index.html',
        },
      ]),
    ],
  };
};
