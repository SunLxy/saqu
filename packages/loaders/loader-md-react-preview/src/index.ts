import { getProcessor, getCodeBlock, getHeading } from './utils';
import { LoaderFunction, Options, CodeBlockData } from './interface';
export * from './interface';

const codePreviewLoader: LoaderFunction = function (source) {
  const options: Options = this.getOptions();
  // console.log("文件路径===>", path.dirname(this.resourcePath))
  let components = '';
  let codeBlock = {} as CodeBlockData['data'];
  const child = getProcessor(source);
  try {
    codeBlock = getCodeBlock(child, options, this.resourcePath);
    Object.keys(codeBlock).forEach((key) => {
      components += `${key}: (function() { ${codeBlock[key].code} })(),`;
    });
  } catch (error) {
    this.emitError(error);
  }

  const headings = getHeading(child);

  return `\nexport default {
    components: { ${components} },
    data: ${JSON.stringify(codeBlock, null, 2)},
    source: ${JSON.stringify(source)},
    headings:${JSON.stringify(headings)},
  }`;
};

export default codePreviewLoader;
