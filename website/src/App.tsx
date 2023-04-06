import { useEffect } from 'react';
import sun from './sun.jpg';
import scgs from './svgs.svg';
import MDs from '@saqu/loader-md-react-preview/README.md';

const APP = () => {
  console.log('MDs', MDs);
  return (
    <div>
      app测试页面
      <img src={sun} />
      <img src={scgs} />
    </div>
  );
};
export default APP;
