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
