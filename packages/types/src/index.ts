import { SpreadElement, Identifier, Span, Expression } from '@swc/core';

class createSwcAstTypes {
  _span(): Span {
    return {
      start: 0,
      end: 0,
      ctxt: 0,
    };
  }

  Identifier(value: string): Identifier {
    return {
      type: 'Identifier',
      value,
      optional: false,
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
}

export default new createSwcAstTypes();
