import path from 'path';
export default {
  proxySetup: () => {
    console.log(22);
    return {
      path: path.join(__dirname, './mocker/index.js'),
    };
  },
};
