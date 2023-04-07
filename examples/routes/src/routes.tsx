import { useRoutes, RouteObject, Outlet } from 'react-router';
import Home from './pages/home';
import About from './pages/about';
import React from 'react';
const config: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
];

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
