import { getProcessor, getCodeBlock } from './utils';
import { LoaderFunction, Options, CodeBlockData } from './interface';
export * from './interface';

const codePreviewLoader: LoaderFunction = function (source) {
  const options: Options = this.getOptions();
  let components = '';
  let codeBlock = {} as CodeBlockData['data'];
  try {
    codeBlock = getCodeBlock(getProcessor(source), options, this.resourcePath);
    Object.keys(codeBlock).forEach((key) => {
      components += `${key}: (function() { ${codeBlock[key].code} })(),`;
    });
  } catch (error) {
    this.emitError(error);
  }

  return `\nexport default {
    components: { ${components} },
    data: ${JSON.stringify(codeBlock, null, 2)},
    source: ${JSON.stringify(source)}
  }`;
};

export default codePreviewLoader;
