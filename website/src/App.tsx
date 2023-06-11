import { useEffect } from 'react';
import sun from './sun.jpg';
import scgs from './svgs.svg';
import MDs from './README.md';
import styles from './styles.module.less';
// import * as DMMMMM from '@saqu/loader-md-react-preview/lib/utils/utils';
const APP = () => {
  console.log('MDs', MDs);

  useEffect(() => {
    // const getda = async () => {
    //   // @ts-ignore
    //   const result = await import("README/doc/index.tsx")
    //   console.log(result)
    // }
  }, []);

  return (
    <div className={styles.layoutWrap}>
      app测试页面
      <img src={sun} />
      <img src={scgs} />
    </div>
  );
};
export default APP;
