export type RouteType = 'Browser' | 'Hash' | 'Memory';

const RouteTypeObj = {
  Browser: 'createBrowserRouter',
  Hash: 'createHashRouter',
  Memory: 'createMemoryRouter',
};

const getRootRoot = () => `
const hanldeRouteData = ()=>{
  const firstRouter = (router_config||[]).find(ite=>ite.path==="/")
  const otherRouter =  (router_config||[]).filter(ite=>ite.path!=="/")
  if(firstRouter){
    return [{...firstRouter,children:[...otherRouter]}]
  }
  return router_config||[]
}
`;

export const getMainCode = (routeType: RouteType, isRoot: boolean) => {
  return `
import ReactDOM from 'react-dom/client';
import { RouterProvider, ${RouteTypeObj[routeType]} } from 'react-router-dom';
import router_config from './routes_config';
${isRoot ? getRootRoot() : ''}

const router = ${RouteTypeObj[routeType]}(${isRoot ? 'hanldeRouteData()' : 'router_config||[]'})

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);

`;
};
