# `@saqu/auto-config-to-routes`

通过配置文件自动生成路由配置

在项目根目录下创建`config/routes.json`路由配置文件

```json
[
  {
    "path":"home",// 跳转路由地址
    "element":"@/pages/home" // 页面文件地址
  }
]
```


## 参数

```ts

export interface AutoConfigToRoutesProps {
  /**
   * 文件是否是默认导出
   * @default false
   */
  isDefault?: boolean;
}

```

### 生成路由文件导出内容方式

**默认导出**

```tsx
// 配置使用方式 .saqurc.ts
import configCreateRoutes from '@saqu/auto-config-to-routes';
export default {
  plugins: [new configCreateRoutes({isDefault:true})],
}

// 路由加载文件 src/pages/about/index.tsx
export default ()=>{
  return <div>默认导出</div>
}

```

**直接导出element用于渲染**

```tsx
// 配置使用方式 .saqurc.ts
import configCreateRoutes from '@saqu/auto-config-to-routes';
export default {
  plugins: [new configCreateRoutes()],
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
import configCreateRoutes from '@saqu/auto-config-to-routes';
export default {
  plugins: [new configCreateRoutes()],
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
