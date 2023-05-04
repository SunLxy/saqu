import { Visitor } from '@swc/core/Visitor';
import { ObjectExpression } from '@swc/core';
import types from '@saqu/swc-types';

export const toPascalCase = (str: string = '') =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('');

/**
 * 1. 对字符串进行ast解析
 * 2.
 */

export class RouteAst extends Visitor {
  /**地址值*/
  elements: Map<string, { componentName: string; path: string }>;
  constructor() {
    super();
  }
  visitObjectExpression(n: ObjectExpression) {
    const element = n.properties.find(
      (ite) => ite.type === 'KeyValueProperty' && ite.key.type === 'Identifier' && ite.key.value === 'element',
    );
    if (
      element &&
      element.type === 'KeyValueProperty' &&
      element.key.type === 'Identifier' &&
      element.key.value === 'element' &&
      element.value.type === 'StringLiteral'
    ) {
      const value = element.value.value;
      const componentName = toPascalCase(value.replace('@/pages/', '').replace('/', ' '));
      this.elements.set(element.value.value, { componentName, path: value });
      n.properties.push(types.SpreadElement(types.Identifier('rest')));
    }
    return n;
  }
}
