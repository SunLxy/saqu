/*
 * @Description: 重写类型
 */
import { Compiler, Compilation, OutputNormalized, RspackPluginInstance, CompilationParams } from '@rspack/core';
import * as tapable from 'tapable';

export interface S_Compilation extends Omit<Compilation, '#private' | 'children' | 'compiler' | 'createChildCompiler'> {
  children: S_Compilation[];
  compiler: S_Compiler;
  createChildCompiler(name: string, outputOptions: OutputNormalized, plugins: RspackPluginInstance[]): S_Compiler;
}

export interface S_Compiler
  extends Omit<Compiler, '#private' | 'root' | 'createChildCompiler' | 'compilation' | 'parentCompilation'> {
  compilation: S_Compilation;
  root: S_Compiler;
  parentCompilation?: S_Compilation;
  hooks: Compiler['hooks'] & {
    compilation: tapable.SyncHook<[S_Compilation, CompilationParams]>;
    thisCompilation: tapable.SyncHook<[S_Compilation, CompilationParams]>;
    emit: tapable.AsyncSeriesHook<[S_Compilation]>;
    afterEmit: tapable.AsyncSeriesHook<[S_Compilation]>;
    make: tapable.AsyncParallelHook<[S_Compilation]>;
    afterCompile: tapable.AsyncSeriesHook<[S_Compilation]>;
    finishMake: tapable.AsyncSeriesHook<[S_Compilation]>;

    beforeRun: tapable.AsyncSeriesHook<[S_Compiler]>;
    run: tapable.AsyncSeriesHook<[S_Compiler]>;
    watchRun: tapable.AsyncSeriesHook<[Compiler]>;
    afterPlugins: tapable.SyncHook<[Compiler]>;
    afterResolvers: tapable.SyncHook<[Compiler]>;
  };

  createChildCompiler(
    compilation: S_Compilation,
    compilerName: string,
    compilerIndex: number,
    outputOptions: OutputNormalized,
    plugins: RspackPluginInstance[],
  ): S_Compiler;
}
