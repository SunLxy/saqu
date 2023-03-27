import rc from '@proload/plugin-rc';
import json from '@proload/plugin-json';
const presets = ['@babel/preset-env', '@babel/preset-typescript'];
const defaultConfig = [
  rc,
  json,
  {
    name: '@proload/plugin-export-js',
    extensions: ['js', 'jsx', 'ts', 'tsx', 'cts', 'mts'],
    async register(fileName: string) {
      const registers = require('@babel/register');
      if (/\.(js|jsx|ts|tsx?)$/.test(fileName)) {
        registers({
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          presets: presets,
          ignore: [/\/(node_modules)\//],
        });
      } else if (/\.([cm]ts|tsx?)$/.test(fileName)) {
        if (fileName.endsWith('.cts')) {
          registers({
            format: 'cjs',
            extensions: ['.cts'],
            presets: presets,
            ignore: [/\/(node_modules)\//],
          });
        } else {
          registers({
            extensions: ['.ts', '.tsx', '.mts'],
            ignore: [/\/(node_modules)\//],
            presets: presets,
          });
        }
      }
    },
  },
];

export default defaultConfig;
