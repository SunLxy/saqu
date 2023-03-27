import { RspackOptions } from '@rspack/core';
import path from 'path';

export const getRspackBuiltinsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  builtins?: RspackOptions['builtins'],
): RspackOptions['builtins'] => {
  return {
    ...builtins,
    progress: true,
    define: {
      // User defined `process.env.NODE_ENV` always has highest priority than default define
      'process.env.NODE_ENV': JSON.stringify(env),
      ...builtins?.define,
    },
    html: [
      ...(builtins?.html || [
        {
          template: path.join(process.cwd(), 'public', 'index.html'),
        },
      ]),
    ],
  };
};
