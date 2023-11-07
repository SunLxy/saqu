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
