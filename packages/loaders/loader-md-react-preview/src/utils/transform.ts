import {
  transformSync,
  Options as SWCoptions,
  VariableDeclaration,
  VariableDeclarator,
  ClassDeclaration,
  Program,
  FunctionDeclaration,
  plugins,
  Plugin,
  TsParserConfig,
} from '@swc/core';

/**默认导出 变量替换 */
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

/**默认导出 Function 替换 */
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
/**默认导出 类替换 */
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

/**代码转换*/
export interface TransformOptions extends Omit<SWCoptions, 'plugin' | 'filename'> {
  plugin?: Plugin[];
}

export const getTransformValue = (str: string, filename: string, otherOptions: TransformOptions = {}) => {
  try {
    const options: SWCoptions = {
      minify: true,
      ...otherOptions,
      jsc: {
        target: 'esnext', // 输出js的规范
        ...otherOptions?.jsc,
        parser: {
          // 除了 ecmascript，还支持 typescript
          syntax: 'typescript',
          tsx: true,
          // 是否支持装饰器，对应插件 @babel/plugin-syntax-decorators
          decorators: true,
          // 是否支持动态导入，对应插件 @babel/plugin-syntax-dynamic-import
          dynamicImport: true,
          ...(otherOptions?.jsc?.parser as TsParserConfig),
        },
      },
      module: {
        type: 'commonjs',
        ...otherOptions?.module,
      },
      filename,
      plugin: plugins([
        (m) => {
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
        ...(otherOptions?.plugin || []),
      ]),
    };
    /**代码转换*/
    const res = transformSync(str, options);
    /**临时解决报错问题 exports is not defined 问题 */
    const newCode = res.code.replace(/Object.defineProperty\(exports/g, 'Object.defineProperty(__webpack_exports__');
    return `${newCode}\nreturn BaseCode_Export__default__value;\n`;
  } catch (err) {
    console.error('打印错误===>', filename, str, err);
    throw new Error(err);
  }
};
