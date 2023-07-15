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

export const getMainCode = (routeType: RouteType, rootRoutes: boolean | string) => {
  let funStr = '';
  let params = 'router_config || []';
  if (typeof rootRoutes === 'boolean' && rootRoutes) {
    funStr = getRootRoutes();
    params = 'hanldeRouteData()';
  } else if (typeof rootRoutes === 'string' && rootRoutes) {
    funStr = getImportRoutes(rootRoutes);
    params = 'newRoutesConfig';
  }

  return `
import ReactDOM from 'react-dom/client';
import { RouterProvider, ${RouteTypeObj[routeType]} } from 'react-router-dom';
import router_config from './routes_config';
${funStr}
const router = ${RouteTypeObj[routeType]}(${params})

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);

`;
};
