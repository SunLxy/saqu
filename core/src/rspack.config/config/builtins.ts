import { RspackOptions, Builtins } from '@rspack/core';
import path from 'path';

export const getRspackBuiltinsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  builtins?: Builtins,
): Builtins => {
  const newBuiltins: Builtins = builtins || {};

  return {
    ...newBuiltins,
    progress: true,
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
