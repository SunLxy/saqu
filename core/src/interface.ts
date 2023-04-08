import { RspackOptions } from '@rspack/core';
import express from 'express';
import { MockerProxyRoute, MockerOption } from 'mocker-api';
import { DevServer } from '@rspack/core';
import yargsParser from 'yargs-parser';

export interface SAquConfig extends Omit<RspackOptions, 'entry'> {
  proxy?: DevServer['proxy'];
  /**mocker代理*/
  proxySetup?: (app: express.Application) =>
    | {
        path?: string | string[] | MockerProxyRoute;
        options?: MockerOption;
      }
    | undefined;
  /**入口文件*/
  entry?: string;
  /**重写环境配置*/
  overridesRspack?: (
    config: RspackOptions,
    env: 'development' | 'production',
    argvOptions: SAquArgvOptions,
    type: 'server' | 'client',
  ) => Promise<RspackOptions> | RspackOptions;
}

export interface SAquArgvOptions extends yargsParser.Arguments {
  /**使用 webpack-bundle-analyzer*/
  analyze?: boolean;
}
