import path from 'path';
import transformPluginAlias from '@saqu/transform-plugin-import-replace-alias';
export default {
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
                    alias: [
                      {
                        libraryName: 'react-native',
                        alias: 'react-native-web',
                      },
                    ],
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
