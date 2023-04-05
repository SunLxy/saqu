import { useEffect } from 'react';
import sun from './sun.jpg';
import scgs from './svgs.svg';

const APP = () => {
  return (
    <div>
      app测试页面
      <img src={sun} />
      <img src={scgs} />
    </div>
  );
};
export default APP;
