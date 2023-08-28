import rc from '@proload/plugin-rc';
import json from '@proload/plugin-json';
import { register } from '@saqu/swc-register';
import ts from 'typescript';

const defaultConfig = [
  rc,
  json,
  {
    name: '@proload/plugin-export-js',
    extensions: ['js', 'jsx', 'ts', 'tsx', 'cts', 'mts'],
    async register(fileName: string) {
      // const { register } = require('@saqu/swc-register');
      if (/\.(js|jsx|ts|tsx?)$/.test(fileName)) {
        register({
          esModuleInterop: true,
          module: ts.ModuleKind.CommonJS,
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        });
      } else if (/\.([cm]ts|tsx?)$/.test(fileName)) {
        if (fileName.endsWith('.cts')) {
          register({ format: 'cjs', extensions: ['.cts'] });
        } else {
          register({
            esModuleInterop: true,
            module: ts.ModuleKind.CommonJS,
            extensions: ['.ts', '.tsx', '.mts'],
          });
        }
      }
    },
  },
];

export default defaultConfig;
