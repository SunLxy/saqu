import { HeadingListType, HeadingItem, MarkdownParseData } from './../interface';
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

import webpack from 'webpack';
import { Options } from '../interface';

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

/**
 * `webpackRulesLoader` method for adding `@saqu/loader-md-react-preview` to webpack config.
 * @param {webpack.Configuration} config webpack config
 * @param {Options} option Loader Options
 * @returns {webpack.Configuration}
 */
export const webpackRulesLoader = (config: webpack.Configuration, option: Options = {}): webpack.Configuration => {
  config.module.rules.forEach((ruleItem) => {
    if (typeof ruleItem === 'object') {
      if (ruleItem.oneOf) {
        ruleItem.oneOf.unshift({
          test: /.md$/,
          use: [{ loader: '@saqu/loader-md-react-preview', options: { ...option } }],
        });
      }
    }
  });
  return config;
};

/**进行获取同级别数据*/
export const getSameLevelHeading = (list: HeadingListType[]) => {
  const newList: { start: number; end: number }[] = [];
  let level: number = 0;
  let satrtIndex = 0;
  let lg = list.length;

  for (let index = 0; index < lg; index++) {
    const element = list[index];
    if (index === 0) {
      satrtIndex = 0;
      level = element.depth;
    } else if (element.depth === level) {
      // 这个位置相等，说明这些数据是一组数据
      newList.push({ start: satrtIndex, end: index });
      satrtIndex = index;
    }
  }
  // 如果最后位置没找到
  if (satrtIndex <= lg - 1) {
    newList.push({ start: satrtIndex, end: lg });
  }

  const saveList: HeadingItem[] = [];

  newList.forEach((item) => {
    const { start, end } = item;
    const [firstItem, ...lastItems] = list.slice(start, end);
    const newItem: HeadingItem = { ...firstItem };
    if (Array.isArray(lastItems) && lastItems.length) {
      newItem.children = getSameLevelHeading(lastItems);
    }
    saveList.push(newItem);
  });
  return saveList;
};

/**获取标题*/
export const getHeading = (child: MarkdownParseData['children']) => {
  const headingList: HeadingListType[] = [];
  child.forEach((item) => {
    if (item && item.type === 'heading') {
      const { depth, children } = item;
      if (Array.isArray(children) && children.length) {
        const [firstItem] = children || [];
        if (firstItem && firstItem?.value) {
          headingList.push({
            depth,
            value: firstItem?.value,
          });
        }
      }
    }
  });

  return getSameLevelHeading(headingList);
};
