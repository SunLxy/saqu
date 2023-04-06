import React from 'react';
import { getProcessor, getCodeBlock } from './utils';
import { LoaderDefinitionFunction } from 'webpack';
export * from './utils';

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
};

export const FUNNAME_PREFIX = '__BaseCode__';

export type Options = {
  /**
   * Language to parse code blocks, default: `["jsx","tsx"]`
   */
  lang?: string[];
};

const codePreviewLoader: LoaderDefinitionFunction = function (source) {
  const options: Options = this.getOptions();

  let components = '';
  let codeBlock = {} as CodeBlockData['data'];
  try {
    codeBlock = getCodeBlock(getProcessor(source), options, this.resourcePath);
    Object.keys(codeBlock).forEach((key) => {
      components += `${key}: (function() { ${codeBlock[key].code} })(),`;
    });
  } catch (error) {
    this.emitError(error);
  }

  return `\nexport default {
    components: { ${components} },
    data: ${JSON.stringify(codeBlock, null, 2)},
    source: ${JSON.stringify(source)}
  }`;
};

export default codePreviewLoader;
