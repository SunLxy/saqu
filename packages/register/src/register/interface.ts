import { Options as SwcOptions } from '@swc/core';
import * as ts from 'typescript';

export type RegisterOptions = Partial<ts.CompilerOptions> & {
  swc?: SwcOptions;
};
