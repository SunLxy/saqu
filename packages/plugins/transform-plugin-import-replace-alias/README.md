# `@saqu/transform-plugin-import-replace-alias`

替换引入包名称

```ts
import { parseSync } from '@swc/core'

const code = `
import React from 'react';
import * as allReact from 'test-doc';
const Demo = ()=>{
  return <div>222</div>
}
export default Demo;
`;

const m = parseSync(code,{ "syntax": "typescript", "tsx": true, "decorators": true})

new transformPluginAlias({ alias: [{ libraryName: 'test-doc', alias: 'react' }]}).visitProgram(m)

```
