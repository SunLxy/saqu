import {
  transformSync,
  parseSync,
  Options as SWCoptions,
  printSync,
  VariableDeclaration,
  VariableDeclarator,
  ClassDeclaration,
  Program,
} from '@swc/core';

/**
 * 临时解决办法
 *
 * 添加 plugin 插件报错，没找到解决办法
 *
 * **/
const replaceStr = (span: VariableDeclarator['span'], expression: VariableDeclarator['init']): VariableDeclaration => ({
  type: 'VariableDeclaration',
  kind: 'const',
  span,
  declare: false,
  declarations: [
    {
      type: 'VariableDeclarator',
      span: (expression as any).span,
      id: {
        span: (expression as any).span,
        type: 'Identifier',
        value: 'BaseCode_Export__default__value',
        optional: false,
        typeAnnotation: null,
      },
      init: expression,
      definite: false,
    },
  ],
});

const replaceClassStr = (props: ClassDeclaration) => {
  return {
    ...props,
    identifier: {
      ...props.identifier,
      value: 'BaseCode_Export__default__value',
    },
    type: 'ClassDeclaration',
  };
};

export const getTransformValue = (str: string, filename: string) => {
  const options: SWCoptions = {
    filename,
    jsc: {
      target: 'es5', // 输出js的规范
      parser: {
        // 除了 ecmascript，还支持 typescript
        syntax: 'typescript',
        tsx: true,
        // 是否支持装饰器，对应插件 @babel/plugin-syntax-decorators
        decorators: true,
        // 是否支持动态导入，对应插件 @babel/plugin-syntax-dynamic-import
        dynamicImport: true,
      },
    },
    module: { type: 'commonjs' },
    minify: true,
  };
  const ast = parseSync(str, options.jsc.parser);
  const newBody = ast.body.map((item) => {
    if (item.type === 'ExportDefaultDeclaration' && item.decl) {
      return replaceClassStr(item.decl as unknown as ClassDeclaration);
    } else if (item.type === 'ExportDefaultExpression') {
      const { span, expression } = item;
      return replaceStr(span, expression);
    }
    return item;
  });
  const newCode = printSync({ ...ast, body: newBody } as Program);
  const res = transformSync(newCode.code, options);
  return `${res.code}\nreturn BaseCode_Export__default__value;\n`;
};
