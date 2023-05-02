import { useRoutes, RouteObject, Outlet } from 'react-router';
import Home from './pages/home/index';
import About from './pages/about/index';
import React from 'react';
import router_config from '@/.cache/routes_config';
const config: any[] = [
  // {
  //   path: '/',
  //   element: <Home />,
  // },
  // {
  //   path: '/about',
  //   element: <About />,
  // },
  ...router_config,
];
console.log(router_config);

const Route = () => {
  const render = useRoutes(config);
  return (
    <React.Fragment>
      {render}
      <Outlet />
    </React.Fragment>
  );
};
export default Route;
