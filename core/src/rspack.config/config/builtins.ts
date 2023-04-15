import { Builtins } from '@rspack/core';

export const getRspackBuiltinsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  builtins?: Builtins,
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
