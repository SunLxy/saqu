import { ImportDeclaration } from '@swc/core';
import { Visitor } from '@swc/core/Visitor';

export interface AliasProps {
  libraryName: string;
  alias: string;
}
/**替换 import 引入包*/
class ImportReplaceAlias extends Visitor {
  alias: AliasProps[] = [];
  constructor(props: { alias?: AliasProps[] }) {
    super();
    this.alias = props.alias || [];
  }
  visitImportDeclaration(n: ImportDeclaration): ImportDeclaration {
    const value = n.source.value;
    const finx = this.alias.find((ite) => ite.libraryName === value);
    if (finx) {
      n.source.value = finx.alias;
      n.source.raw = finx.alias;
    }
    return n;
  }
}

export default ImportReplaceAlias;
