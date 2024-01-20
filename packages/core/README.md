saqu
===

## 参考对象

1. 参考 `react-scripts` webpack 进行 配置

## 功能

- [X] 正常的项目进行打包和开发
- [X] md文档解析代码块进行渲染
- [X] import引入替换
- [X] 支持自动对入口文件进行生成
- [X] 支持自动生成路由
- [ ] 添加项目`app.{ts,tsx,jsx,js}`可以对路由之类的进行操作和配置
- [ ] 添加支持直接使用md文件做路由进行渲染md内容

## 安装

```bash
$ npm install saqu # yarn add saqu
```
## 命令

```bash
Usage: saqu [start|build] [--help|h]
  Displays help information.
Options:
  --help, -h              Displays help information.
Example:
$ saqu  build
$ saqu  start

```

## 快速创建项目

```bash
$ npx create-saqu my-app
```

## 配置参数

```ts
import { RspackOptions, SwcJsMinimizerRspackPluginOptions } from '@rspack/core';
import express from 'express';
import { MockerProxyRoute, MockerOption } from 'mocker-api';
import { DevServer } from '@rspack/core';
import yargsParser from 'yargs-parser';

/**
 * @description rspack 运行配置
 */
export interface SAquConfig extends RspackOptions {
  /**
   * @description 配置代理，可用于解决跨域等问题
   * @example
   * proxy: {
   *  '/api': {
   *    target: 'http://localhost:3000',
   *    changeOrigin: true,
   *  },
   * },
   * */
  proxy?: DevServer['proxy'];
  /**
   * @description mocker代理
   **/
  proxySetup?: (app: express.Application) =>
    | {
        path?: string | string[] | MockerProxyRoute;
        options?: MockerOption;
      }
    | undefined;
  /**
   * @description 重写环境配置
   */
  overridesRspack?: (
    config: RspackOptions,
    env: 'development' | 'production' | 'preview',
    argvOptions: SAquArgvOptions,
    type: 'server' | 'client',
  ) => Promise<RspackOptions> | RspackOptions;

  /**用来压缩 JS 产物 配置*/
  _JS_minifyOptions?: SwcJsMinimizerRspackPluginOptions;
}

/**
 * @description 命令行参数
 */
export interface SAquArgvOptions extends yargsParser.Arguments {
  /**
   * @description 使用 webpack-bundle-analyzer
   */
  analyze?: boolean;
  /**输出目录*/
  dir?: string;
  /**帮助*/
  help?: boolean;
  /**帮助(简写)*/
  h?: boolean;
}

```

## 基础配置

```ts
// .saqurc.ts
import { defineConfig } from "saqu"

export default ()=>defineConfig({
  // ...配置
})

```

## 重写配置

```ts
// .saqurc.ts
import { defineConfig } from "saqu"

export default ()=>defineConfig({
  // ...配置
  overridesRspack:(config,env,argvOptions,type)=>{
    return config;
  }
})

```

## 插件使用

```ts
// .saqurc.ts
import { defineConfig } from "saqu"
import createRoutes from '@saqu/auto-config-to-routes';

export default ()=>defineConfig({
  // ...配置
  plugins: [new createRoutes()],
})

```

## `entry`配置

默认入口文件`src/index.{js|tsx|jsx}`

当使用`!`开头的路径时，不进行校验文件是否存在(适用于自动生成入口文件)

其他情况会进行校验入口文件是否存在

```ts
// .saqurc.ts
import { defineConfig } from "saqu"
import createRoutes from '@saqu/auto-config-to-routes';

export default ()=>defineConfig({
  // ...配置
  entry: '!src/.cache/main.jsx',
})

```
