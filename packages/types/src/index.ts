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
} from '@swc/core';

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
}

export default new createSwcAstTypes();
