import path from 'path';
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
        use: '@saqu/loader-md-react-preview',
        type: 'typescript',
      },
    ],
  },
};
