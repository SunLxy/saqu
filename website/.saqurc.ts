import path from 'path';
export default {
  proxy: { a: '' },
  proxySetup: () => {
    return {
      path: path.join(__dirname, './mocker/index.js'),
    };
  },
};
