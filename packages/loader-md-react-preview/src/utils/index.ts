import { Parent, Node } from 'unist';
import remark from 'remark';
import { getTransformValue } from './transform';
import { Options, FUNNAME_PREFIX, CodeBlockItem, CodeBlockData } from '../';

/**
 * Creates an object containing the parameters of the current URL.
 *
 * ```js
 * getURLParameters('name=Adam&surname=Smith');
 * // 👉 {name: 'Adam', surname: 'Smith'}
 * ```
 * @param url `name=Adam&surname=Smith`
 * @returns
 */
export const getURLParameters = (url: string): Record<string, string> => {
  const regex = /([^?=&]+)=([^&]*)/g;
  const params: Record<string, string> = {};
  let match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};

export interface MarkdownDataChild extends Node {
  lang: string;
  meta: string;
  value: string;
}

export interface MarkdownParseData extends Parent<MarkdownDataChild> {}

/** 转换 代码*/
export const getProcessor = (source: string) => {
  try {
    const child = remark.parse(source) as MarkdownParseData;
    return child.children;
  } catch (err) {
    console.warn(err);
  }
};

/**
 * ```js
 * 'mdx:preview' => ''  // Empty
 * 'mdx:preview:demo12' => 'demo12' // return meta id => 'demo12'
 * ```
 * @param meta string
 * @returns string?
 */
export const getMetaId = (meta: string = '') => {
  const [metaRaw = ''] = /mdx:(.[\w|:]+)/i.exec(meta) || [];
  return metaRaw.replace(/^mdx:preview:?/, '');
};

/**
 * ```js
 * isMeta('mdx:preview') => true
 * isMeta('mdx:preview:demo12') => true
 * isMeta('mdx:preview--demo12') => false
 * ```
 * @param meta
 * @returns boolean
 */
export const isMeta = (meta: string = '') => meta && meta.includes('mdx:preview');

/** 获取需要渲染的代码块 **/
export function getCodeBlock(
  child: MarkdownParseData['children'],
  opts: Options = {},
  resourcePath?: string,
): CodeBlockData['data'] {
  const { lang = ['jsx', 'tsx'], ...rest } = opts;
  // 获取渲染部分
  const codeBlock: Record<string | number, CodeBlockItem> = {};
  child.forEach((item) => {
    if (item && item.type === 'code' && lang.includes(item.lang)) {
      const line = item.position.start.line;
      const metaId = getMetaId(item.meta);
      if (isMeta(item.meta)) {
        let name = metaId || line;
        const funName = `${resourcePath}.${FUNNAME_PREFIX}${name}`;
        const returnCode = getTransformValue(item.value, `${funName}.${item.lang}`, rest);
        codeBlock[name] = {
          name,
          meta: getURLParameters(item.meta),
          code: returnCode,
          language: item.lang,
          value: item.value,
        };
      }
    }
  });
  return codeBlock;
}
