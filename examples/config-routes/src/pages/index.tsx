import { Outlet } from 'react-router-dom';
const Index = () => {
  return (
    <div>
      Index
      <Outlet />
    </div>
  );
};
export const element = <Index />;

export default Index;
