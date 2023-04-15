import { Resolve } from '@rspack/core';
import path from 'path';
const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];
export const getRspackResolveConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  resolve?: Resolve,
): Resolve => {
  const newResolve: Resolve = resolve || {};

  return {
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
    ...newResolve,
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      'react-native': 'react-native-web',
      ...newResolve?.alias,
    },
  };
};
