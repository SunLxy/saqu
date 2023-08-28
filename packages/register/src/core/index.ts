import { transform as swcTransform, transformSync as swcTransformSync, Options as SwcOptions } from '@swc/core';
import { Options } from './interface';
export * from './interface';

const transformOption = (path: string, options?: Options, jest = false): SwcOptions => {
  const opts = options == null ? {} : options;
  opts.esModuleInterop = opts.esModuleInterop ?? true;
  return {
    filename: path,
    jsc: options?.swc?.swcrc
      ? undefined
      : {
          target: opts.target ?? 'es2018',
          externalHelpers: jest ? true : Boolean(opts.externalHelpers),
          parser: {
            syntax: 'typescript' as const,
            tsx: typeof opts.jsx !== 'undefined' ? opts.jsx : path.endsWith('.tsx'),
            decorators: Boolean(opts.experimentalDecorators),
            dynamicImport: Boolean(opts.dynamicImport),
          },
          transform: {
            legacyDecorator: Boolean(opts.experimentalDecorators),
            decoratorMetadata: Boolean(opts.emitDecoratorMetadata),
            react: options?.react,
            // @ts-expect-error
            hidden: {
              jest,
            },
          },
          keepClassNames: opts.keepClassNames,
          paths: opts.paths,
          baseUrl: opts.baseUrl,
        },
    minify: false,
    isModule: true,
    module: {
      type: options?.module ?? 'commonjs',
      noInterop: !opts.esModuleInterop,
    },
    sourceMaps: jest || typeof opts.sourcemap === 'undefined' ? 'inline' : opts.sourcemap,
    inlineSourcesContent: true,
    swcrc: false,
    ...(options?.swc ?? {}),
  };
};

export function transformSync(source: string, path: string, options?: Options) {
  return swcTransformSync(source, transformOption(path, options));
}

export function transformJest(source: string, path: string, options?: Options) {
  return swcTransformSync(source, transformOption(path, options, true));
}

export function transform(source: string, path: string, options?: Options) {
  return swcTransform(source, transformOption(path, options));
}
