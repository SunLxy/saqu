import remark from 'remark';
import { getTransformValue } from './transform';
import { Options, FUNNAME_PREFIX, CodeBlockItem, CodeBlockData, MarkdownParseData } from '../interface';
import { getURLParameters, getMetaId, isMeta } from './utils';
export * from './utils';

/** 转换 代码*/
export const getProcessor = (source: string) => {
  try {
    const child = remark.parse(source) as MarkdownParseData;
    return child.children;
  } catch (err) {
    console.warn(err);
  }
};

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
