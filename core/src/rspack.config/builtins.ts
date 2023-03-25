import { RspackOptions } from '@rspack/core';
import path from 'path';

export const getRspackBuiltinsConfig = (env: 'development' | 'production'): RspackOptions['builtins'] => {
  return {
    define: {
      // User defined `process.env.NODE_ENV` always has highest priority than default define
      'process.env.NODE_ENV': JSON.stringify(env),
    },
    html: [
      {
        template: path.join(process.cwd(), 'public', 'index.html'),
      },
    ],
  };
};
