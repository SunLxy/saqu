import path from 'path';
import transformPluginAlias from '@saqu/transform-plugin-import-replace-alias';
// import { defineConfig } from 'saqu';

// 第一种
export default {
  output: {
    publicPath: './',
  },
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

// 第二种
// export default () => defineConfig({
//   proxySetup: () => {
//     return {
//       path: path.join(__dirname, './mocker/index.js'),
//     };
//   },
//   module: {
//     rules: [
//       {
//         test: /\.md$/,
//         use: [
//           {
//             loader: '@saqu/loader-md-react-preview',
//             options: {
//               plugin: [
//                 (m: any) => {
//                   return new transformPluginAlias({
//                     alias: [{ libraryName: 'test-doc', alias: 'react' }],
//                   }).visitProgram(m);
//                 },
//               ],
//             },
//           },
//         ],
//         type: 'typescript',
//       },
//     ],
//   },
// });

// 第三种
// export default defineConfig({
//   proxySetup: () => {
//     return {
//       path: path.join(__dirname, './mocker/index.js'),
//     };
//   },
//   module: {
//     rules: [
//       {
//         test: /\.md$/,
//         use: [
//           {
//             loader: '@saqu/loader-md-react-preview',
//             options: {
//               plugin: [
//                 (m: any) => {
//                   return new transformPluginAlias({
//                     alias: [{ libraryName: 'test-doc', alias: 'react' }],
//                   }).visitProgram(m);
//                 },
//               ],
//             },
//           },
//         ],
//         type: 'typescript',
//       },
//     ],
//   },
// });
