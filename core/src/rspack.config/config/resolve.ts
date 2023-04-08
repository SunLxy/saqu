import { Resolve } from '@rspack/core';
import path from 'path';

export const getRspackResolveConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  resolve?: Resolve,
): Resolve => {
  const newResolve: Resolve = resolve || {};
  return {
    ...newResolve,
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      ...newResolve?.alias,
    },
  };
};
