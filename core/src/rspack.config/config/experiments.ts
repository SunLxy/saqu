import { Experiments } from '@rspack/core';
import path from 'path';

export const getRspackExperimentsConfig = (
  env: 'development' | 'production',
  type: 'server' | 'client',
  experiments?: Experiments,
): Experiments => {
  return {
    incrementalRebuild: true,
    ...experiments,
  };
};
