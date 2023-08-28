import { platform } from 'os';
import { resolve } from 'path';
import { Options, transform, transformSync } from '../core';
import { installSourceMapSupport, SourcemapMap } from '@swc-node/sourcemap-support';
import { addHook } from 'pirates';
import * as ts from 'typescript';
import { RegisterOptions } from './interface';

const DEFAULT_EXTENSIONS = ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'];
const PLATFORM = platform();

const injectInlineSourceMap = ({
  filename,
  code,
  map,
}: {
  filename: string;
  code: string;
  map: string | undefined;
}): string => {
  if (map) {
    SourcemapMap.set(filename, map);
    const base64Map = Buffer.from(map, 'utf8').toString('base64');
    const sourceMapContent = `//# sourceMappingURL=data:application/json;charset=utf-8;base64,${base64Map}`;
    return `${code}\n${sourceMapContent}`;
  }
  return code;
};

export function compile(
  sourcecode: string,
  filename: string,
  options: RegisterOptions & { fallbackToTs?: (filename: string) => boolean },
): string;

export function compile(
  sourcecode: string,
  filename: string,
  options: RegisterOptions & { fallbackToTs?: (filename: string) => boolean },
  async: false,
): string;

export function compile(
  sourcecode: string,
  filename: string,
  options: RegisterOptions & { fallbackToTs?: (filename: string) => boolean },
  async: true,
): Promise<string>;

export function compile(
  sourcecode: string,
  filename: string,
  options: RegisterOptions & { fallbackToTs?: (filename: string) => boolean },
  async: boolean,
): string | Promise<string>;

export function compile(
  sourcecode: string,
  filename: string,
  options: RegisterOptions & { fallbackToTs?: (filename: string) => boolean },
  async = false,
) {
  if (filename.endsWith('.d.ts')) {
    return '';
  }
  if (options.files && (options.files as string[]).length) {
    if (
      PLATFORM === 'win32' &&
      (options.files as string[]).every((file) => filename !== resolve(process.cwd(), file))
    ) {
      return sourcecode;
    }
    if (PLATFORM !== 'win32' && (options.files as string[]).every((file) => !filename.endsWith(file))) {
      return sourcecode;
    }
  }
  if (options && typeof options.fallbackToTs === 'function' && options.fallbackToTs(filename)) {
    delete options.fallbackToTs;
    const { outputText, sourceMapText } = ts.transpileModule(sourcecode, {
      fileName: filename,
      compilerOptions: options,
    });
    return injectInlineSourceMap({ filename, code: outputText, map: sourceMapText });
  }
  let swcRegisterConfig: Options;
  // when SWCRC environment variable is set to true it will use swcrc file
  swcRegisterConfig = {
    swc: {
      swcrc: true,
      ...options?.swc,
    },
  };
  if (async) {
    return transform(sourcecode, filename, swcRegisterConfig).then(({ code, map }) => {
      return injectInlineSourceMap({ filename, code, map });
    });
  } else {
    const { code, map } = transformSync(sourcecode, filename, swcRegisterConfig);
    return injectInlineSourceMap({ filename, code, map });
  }
}

export function register(options: RegisterOptions = {}, hookOpts = {}) {
  installSourceMapSupport();
  return addHook((code, filename) => compile(code, filename, options), {
    exts: DEFAULT_EXTENSIONS,
    ...hookOpts,
  });
}
