import rc from '@proload/plugin-rc';
import json from '@proload/plugin-json';
const defaultConfig = [
  rc,
  json,
  {
    name: '@proload/plugin-export-js',
    extensions: ['js', 'jsx', 'ts', 'tsx', 'cts', 'mts'],
    async register(fileName: string) {
      const { register } = require('@swc-node/register/register');
      if (/\.(js|jsx|ts|tsx?)$/.test(fileName)) {
        register({
          esModuleInterop: true,
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        });
      } else if (/\.([cm]ts|tsx?)$/.test(fileName)) {
        if (fileName.endsWith('.cts')) {
          register({ format: 'cjs', extensions: ['.cts'] });
        } else {
          register({
            esModuleInterop: true,
            extensions: ['.ts', '.tsx', '.mts'],
          });
        }
      }
    },
  },
];

export default defaultConfig;
