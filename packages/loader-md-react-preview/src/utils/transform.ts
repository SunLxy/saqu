import {
  transformSync,
  Options as SWCoptions,
  VariableDeclaration,
  VariableDeclarator,
  ClassDeclaration,
  Program,
  FunctionDeclaration,
} from '@swc/core';

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

const replaceFunctionStr = (props: FunctionDeclaration) => {
  return {
    ...props,
    identifier: {
      ...props.identifier,
      value: 'BaseCode_Export__default__value',
    },
    type: 'FunctionDeclaration',
  };
};
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
  try {
    const options: SWCoptions = {
      filename,
      jsc: {
        target: 'esnext', // 输出js的规范
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
      plugin: (m) => {
        const { body, ...rest } = m;
        const newBody = body.map((item) => {
          if (item.type === 'ExportDefaultDeclaration' && item.decl) {
            // 判断是否是 function 导出
            if (item.decl && item.decl.type === 'FunctionExpression') {
              return replaceFunctionStr(item.decl as unknown as FunctionDeclaration);
            }
            return replaceClassStr(item.decl as unknown as ClassDeclaration);
          } else if (item.type === 'ExportDefaultExpression') {
            const { span, expression } = item;
            return replaceStr(span, expression);
          }
          return item;
        });
        return { ...rest, body: newBody } as Program;
      },
    };
    const res = transformSync(str, options);
    return `${res.code}\nreturn BaseCode_Export__default__value;\n`;
  } catch (err) {
    console.error('打印错误===>', filename, str, err);
    throw new Error(err);
  }
};
