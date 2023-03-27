import path from 'path';
export default {
  proxy: { a: '12' },
  proxySetup: () => {
    return {
      path: path.join(__dirname, './mocker/index.js'),
    };
  },
};
