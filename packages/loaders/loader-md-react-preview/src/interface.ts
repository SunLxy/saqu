import React from 'react';
import { TransformOptions } from './utils/transform';
import { LoaderContext } from '@rspack/core';
import type { Parent, Node } from 'unist';

export declare interface LoaderFunction {
  (this: LoaderContext, content: string): string | void | Buffer | Promise<string | Buffer>;
}

export type CodeBlockItem = {
  /** The code after the source code conversion. **/
  code?: string;
  /** original code block **/
  value?: string;
  /** code block programming language **/
  language?: string;
  /** The index name, which can be customized, can be a row number. */
  name?: string | number;
  /** The `meta` parameter is converted into an `object`. */
  meta?: Record<string, string>;
};

export type CodeBlockData = {
  source: string;
  components: Record<CodeBlockItem['name'], React.FC>;
  data: Record<CodeBlockItem['name'], CodeBlockItem>;
  headings?: HeadingItem[];
  headingsList?: HeadingListType[];
};

export const FUNNAME_PREFIX = '__BaseCode__';

export type Options = {
  /**
   * Language to parse code blocks, default: `["jsx","tsx"]`
   */
  lang?: string[];
  /**是否解析标题*/
  isHeading?: boolean;
} & TransformOptions;

export interface MarkdownDataChild extends Node {
  lang: string;
  meta: string;
  value: string;
  depth?: number;
  children?: Array<MarkdownDataChild>;
}

export interface MarkdownParseData extends Parent<MarkdownDataChild> {}

export interface HeadingListType {
  depth: number;
  value: string;
  key: number;
}

export interface HeadingItem extends HeadingListType {
  /**嵌套子标题*/
  children?: HeadingItem[];
}
