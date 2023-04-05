import path from 'path';
export default {
  proxySetup: () => {
    return {
      path: path.join(__dirname, './mocker/index.js'),
    };
  },
};
