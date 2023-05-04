import { Visitor } from '@swc/core/Visitor';
import { ImportDefaultSpecifier, ImportSpecifier, ObjectExpression, parseSync, printSync, Program } from '@swc/core';
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
  elements: Map<string, { componentName: string; path: string }> = new Map([]);
  /**引入组件*/
  imports: string = ``;
  /**解构导入的其他参数*/
  constValues: string = ``;
  /**是否已经导入 React*/
  isImportReact: boolean = false;
  isDefault = false;
  constructor(isDefault: boolean) {
    super();
    this.isDefault = isDefault || false;
  }

  _init(value: string) {
    this.isImportReact = false;
    this.imports = '';
    this.constValues = '';
    this.elements = new Map([]);
    // 先转换成ast
    const ast = parseSync(value, {
      syntax: 'typescript',
      tsx: true,
      decorators: true,
    });
    const newAst = this.visitProgram(ast);
    const { body, ...rest } = newAst;
    const importBody = body.filter((item) => item.type === 'ImportDeclaration');
    const otherBody = body.filter((item) => item.type !== 'ImportDeclaration');
    const importCode = printSync({ ...rest, body: importBody } as Program);
    const otherCode = printSync({ ...rest, body: otherBody } as Program);
    const reactStr = this.isImportReact ? '' : `import React from "react";\n`;
    return `${reactStr}${importCode.code}${this.imports}${this.constValues}${otherCode.code}`;
  }

  visitImportDefaultSpecifier(node: ImportDefaultSpecifier): ImportSpecifier {
    if (node.local.value === 'React') {
      this.isImportReact = true;
    }
    return node;
  }

  visitObjectExpression(n: ObjectExpression) {
    const element = n.properties.find(
      (ite) =>
        ite.type === 'KeyValueProperty' &&
        (ite.key.type === 'Identifier' || ite.key.type === 'StringLiteral') &&
        ite.key.value === 'element',
    );
    if (
      element &&
      element.type === 'KeyValueProperty' &&
      (element.key.type === 'Identifier' || element.key.type === 'StringLiteral') &&
      element.key.value === 'element' &&
      element.value.type === 'StringLiteral'
    ) {
      const value = element.value.value;
      const componentName = toPascalCase(value.replace('@/pages/', '').replace('/', ' '));
      this.imports += `import * as ${componentName}All from "${value}";\n`;
      this.constValues += `const { default: ${componentName}Default,...${componentName}Other } = ${componentName}All;\n`;
      this.elements.set(element.value.value, { componentName, path: value });
      if (this.isDefault) {
        element.value = types.JSXElement(
          types.JSXOpeningElement(types.Identifier(`${componentName}Default`), [], true),
          [],
        );
      } else {
        n.properties = n.properties.filter(
          (ite) =>
            !(
              ite.type === 'KeyValueProperty' &&
              (ite.key.type === 'Identifier' || ite.key.type === 'StringLiteral') &&
              ite.key.value === 'element'
            ),
        );
      }
      n.properties.push(types.SpreadElement(types.Identifier(`${componentName}Other`)));
    }
    return n;
  }
}
