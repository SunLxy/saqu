# `@saqu/auto-create-tree-routes`

自动生成树型路由配置
## 参数

```ts
export type IgnoreFunction = (file: string, stats: FS.Stats) => boolean;
export type Ignores = ReadonlyArray<string | IgnoreFunction>;

export type RouteItemConfigType = {
  /**引入组件名称*/
  componentName: string;
  /**页面引入地址*/
  newFilePath: string;
  /**路由跳转地址*/
  pathName: string;
  /**未处理后缀之类的页面引入地址*/
  oFilePath: string;
  /**在当前生成路由的数组中下标位置*/
  index?: number;
};

export type RenderReturnType = {
  /**
   * @description 引入字符串
   * @example `import * as ${ComName} from "${newFilePath}";\n`
   * @todo 其中的  ComName 为 componentName和index 进行拼接字符串;
   */
  importStr?: string;
  /**
   * @description 结构赋值字符串
   * @example `const { default:${ComName}Default,...${ComName}Other  } = ${ComName};\n`
   * @todo 其中的  ComName 为 componentName和index 进行拼接字符串;
   */
  otherStr?: string;
  /**
   * @description 路由配置对象字符串
   * @example `\t{ path:"${pathName}",element:<${ComName}Default />,...${ComName}Other },\n`
   * @todo 其中的  ComName 为 componentName和index 进行拼接字符串;
   */
  configStr?: string;
};

export interface AutoCreateTreeRoutesProps extends GetFilesPathProps {
  /**
   * 文件是否是默认导出
   * @default false
   */
  isDefault?: boolean;
  /**自定义设置配置*/
  renderConfig?: (props: Required<RouteItemConfigType>) => RenderReturnType;
  /**预设导入内容*/
  presetsImport?: string;
  rootRoutes?: boolean | string;
  /**是否生成树型结构*/
  isTree?: boolean;
}
```

### 生成路由文件导出内容方式

**默认导出**

```tsx
// 配置使用方式 .saqurc.ts
import autoCreateRoutes from '@saqu/auto-create-routes';
export default {
  plugins: [new autoCreateRoutes({isDefault:true})],
}

// 路由加载文件 src/pages/about/index.tsx
export default ()=>{
  return <div>默认导出</div>
}

```

**直接导出element用于渲染**

```tsx
// 配置使用方式 .saqurc.ts
import autoCreateRoutes from '@saqu/auto-create-routes';
export default {
  plugins: [new autoCreateRoutes()],
}

// 路由加载文件  src/pages/about/index.tsx
const Index = ()=>{
  return <div>导出element</div>
}
export const element = <Index />;

```

**导出符合router 6其他参数**
通过直接导出变量的方式添加路由配置中其他参数

```tsx
// 配置使用方式 .saqurc.ts
import autoCreateRoutes from '@saqu/auto-create-routes';
export default {
  plugins: [new autoCreateRoutes()],
}

// 路由加载文件 src/pages/about/index.tsx
const Index = ()=>{
  return <div>导出element</div>
}
export const element = <Index />;
export const loader = ()=>{}
export const action = ()=>{}
const ErrorElement = ()=><div>errorElement</div>
export const errorElement =<ErrorElement />
export const lazy=()=>import("@/about")
export const path="/about"
export const shouldRevalidate=({ currentUrl }) => {
  // only revalidate if the submission originates from
  // the `/meal-plans/new` route.
  return currentUrl.pathname === "/meal-plans/new";
}
```
