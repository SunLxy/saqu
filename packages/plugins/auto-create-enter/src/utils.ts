export type RouteType = 'Browser' | 'Hash' | 'Memory';

const RouteTypeObj = {
  Browser: 'createBrowserRouter',
  Hash: 'createHashRouter',
  Memory: 'createMemoryRouter',
};

const getRootRoutes = () => `
const hanldeRouteData = ()=>{
  const firstRouter = (router_config||[]).find(ite=>ite.path==="/")
  const otherRouter =  (router_config||[]).filter(ite=>ite.path!=="/")
  if(firstRouter){
    return [{...firstRouter,children:[...otherRouter]}]
  }
  return router_config||[]
}
`;

const getImportRoutes = (path: string) => `
import RootRoutes from "${path}";

const newRoutesConfig=[
  {
    path:"/",
    element: <RootRoutes />,
    children: router_config||[]
  }
]
`;

export const getMainCode = (
  routeType: RouteType,
  rootRoutes: boolean | string,
  routePath: string,
  warpOutlet?: string,
) => {
  let funStr = '';
  let params = 'router_config || []';
  if (typeof rootRoutes === 'boolean' && rootRoutes) {
    funStr = getRootRoutes();
    params = 'hanldeRouteData()';
  } else if (typeof rootRoutes === 'string' && rootRoutes) {
    funStr = getImportRoutes(rootRoutes);
    params = 'newRoutesConfig';
  }
  let warp = '';
  if (typeof warpOutlet === 'string') {
    warp = `import WarpOutlet from '${warpOutlet}';\n`;
  }
  let createRoot = `ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);`;
  if (warp) {
    createRoot = `ReactDOM.createRoot(document.getElementById('root')).render(<WarpOutlet routerConfig={router_config} router={router}><RouterProvider router={router} /></WarpOutlet>);`;
  }
  return `
import ReactDOM from 'react-dom/client';
import { RouterProvider, ${RouteTypeObj[routeType]} } from 'react-router-dom';
import router_config from '${routePath}';
${warp}
${funStr}
const router = ${RouteTypeObj[routeType]}(${params})
${createRoot}
`;
};
