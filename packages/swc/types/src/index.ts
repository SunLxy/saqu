import {
  SpreadElement,
  Identifier,
  Span,
  Expression,
  JSXElement,
  JSXOpeningElement,
  JSXElementChild,
  JSXClosingElement,
  JSXElementName,
  JSXAttributeOrSpread,
  TsTypeParameterInstantiation,
  VariableDeclaration,
  VariableDeclarator,
  VariableDeclarationKind,
  Pattern,
  CallExpression,
  Super,
  Import,
  Argument,
  ParenthesisExpression,
  FunctionExpression,
  BlockStatement,
  Statement,
  ReturnStatement,
  ClassDeclaration,
  ClassExpression,
} from '@swc/core';

import { OmitKey } from './interface';

class createSwcAstTypes {
  _span(): Span {
    return {
      start: 0,
      end: 0,
      ctxt: 0,
    };
  }

  Identifier(value: string, optional: boolean = false): Identifier {
    return {
      type: 'Identifier',
      value,
      optional,
      span: this._span(),
    };
  }

  SpreadElement(expression: Expression): SpreadElement {
    return {
      type: 'SpreadElement',
      spread: this._span(),
      arguments: expression,
    };
  }

  JSXOpeningElement(
    name: JSXElementName,
    attributes: JSXAttributeOrSpread[],
    selfClosing: boolean,
    typeArguments?: TsTypeParameterInstantiation,
  ): JSXOpeningElement {
    return {
      type: 'JSXOpeningElement',
      span: this._span(),
      name,
      attributes,
      selfClosing,
      typeArguments,
    };
  }

  JSXElement(opening: JSXOpeningElement, children: JSXElementChild[], closing?: JSXClosingElement): JSXElement {
    return {
      type: 'JSXElement',
      span: this._span(),
      opening,
      children,
      closing,
    };
  }

  VariableDeclaration(
    declarations: VariableDeclarator[],
    kind: VariableDeclarationKind = 'const',
  ): VariableDeclaration {
    return {
      kind,
      type: 'VariableDeclaration',
      span: this._span(),
      declarations,
      declare: false,
    };
  }

  VariableDeclarator(id: Pattern, init?: Expression): VariableDeclarator {
    return {
      type: 'VariableDeclarator',
      span: this._span(),
      id,
      init,
      definite: false,
    };
  }

  CallExpression(
    callee: Super | Import | Expression,
    args: Argument[] = [],
    typeArguments?: TsTypeParameterInstantiation,
  ): CallExpression {
    return {
      type: 'CallExpression',
      span: this._span(),
      callee,
      arguments: args,
      typeArguments,
    };
  }

  ParenthesisExpression(expression: Expression): ParenthesisExpression {
    return {
      type: 'ParenthesisExpression',
      span: this._span(),
      expression,
    };
  }

  FunctionExpression(
    props: OmitKey<
      Omit<FunctionExpression, 'type' | 'span'>,
      'async' | 'params' | 'decorators' | 'identifier' | 'generator' | 'typeParameters' | 'returnType'
    >,
  ): FunctionExpression {
    return {
      type: 'FunctionExpression',
      span: this._span(),
      async: false,
      generator: false,
      params: [],
      decorators: [],
      ...props,
    };
  }

  BlockStatement(stmts: Statement[]): BlockStatement {
    return {
      type: 'BlockStatement',
      span: this._span(),
      stmts,
    };
  }

  ReturnStatement(argument?: Expression): ReturnStatement {
    return {
      type: 'ReturnStatement',
      span: this._span(),
      argument,
    };
  }

  ClassDeclaration(
    props: OmitKey<Omit<ClassDeclaration, 'type'>, 'decorators' | 'declare' | 'isAbstract' | 'implements'>,
  ): ClassDeclaration {
    return {
      type: 'ClassDeclaration',
      decorators: [],
      declare: false,
      isAbstract: false,
      implements: [],
      ...props,
    };
  }

  ClassExpression(
    props: OmitKey<Omit<ClassExpression, 'type'>, 'decorators' | 'isAbstract' | 'implements'>,
  ): ClassExpression {
    return {
      type: 'ClassExpression',
      span: this._span(),
      decorators: [],
      isAbstract: false,
      implements: [],
      ...props,
    };
  }
}

export default new createSwcAstTypes();
