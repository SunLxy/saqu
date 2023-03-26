import { RspackOptions } from '@rspack/core';
import express from 'express';
import { MockerProxyRoute, MockerOption } from 'mocker-api';
import { DevServer } from '@rspack/core';

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
    type: 'server' | 'client',
  ) => Promise<RspackOptions> | RspackOptions;
}
