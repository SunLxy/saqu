import path from 'path';
import transformPluginAlias from '@saqu/transform-plugin-import-replace-alias';
export default {
  proxySetup: () => {
    return {
      path: path.join(__dirname, './mocker/index.js'),
    };
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: '@saqu/loader-md-react-preview',
            options: {
              plugin: [
                (m: any) => {
                  return new transformPluginAlias({
                    alias: [{ libraryName: 'test-doc', alias: 'react' }],
                  }).visitProgram(m);
                },
              ],
            },
          },
        ],
        type: 'typescript',
      },
    ],
  },
};
