import { Options as SwcOptions, ReactConfig, Config, JscTarget } from '@swc/core';

export interface Options {
  target?: JscTarget;
  module?: 'commonjs' | 'umd' | 'amd' | 'es6';
  sourcemap?: Config['sourceMaps'];
  jsx?: boolean;
  experimentalDecorators?: boolean;
  emitDecoratorMetadata?: boolean;
  dynamicImport?: boolean;
  esModuleInterop?: boolean;
  keepClassNames?: boolean;
  externalHelpers?: boolean;
  react?: Partial<ReactConfig>;
  baseUrl?: string;
  paths?: {
    [from: string]: [string];
  };
  swc?: SwcOptions;
}
