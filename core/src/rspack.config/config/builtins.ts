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
  const isEnvDevelopment = env === 'development';
  return {
    ...newBuiltins,
    progress: true,
    react: {
      // 这个添加 false 解决控制台 $refreshSig$ 报错
      refresh: false,
      ...newBuiltins?.react,
    },
    define: {
      // User defined `process.env.NODE_ENV` always has highest priority than default define
      'process.env.NODE_ENV': JSON.stringify(env),
      // react-native 组件中使用
      __DEV__: JSON.stringify(env),
      ...otherConfig?.define,
      ...newBuiltins?.define,
    },
    copy: {
      ...newBuiltins?.copy,
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: ['**/index.html'],
          },
        },
        ...(newBuiltins?.copy?.patterns || []),
      ] as Builtins['copy']['patterns'],
    },
    html: [
      ...(newBuiltins?.html || [
        {
          template: './public/index.html',
        },
      ]),
    ],
  };
};
