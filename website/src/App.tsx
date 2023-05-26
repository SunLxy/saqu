import { useEffect } from 'react';
import sun from './sun.jpg';
import scgs from './svgs.svg';
// import MDs from '@saqu/loader-md-react-preview/README.md';
import styles from './styles.module.less';
import * as DMMMMM from '@saqu/loader-md-react-preview/lib/main';
const APP = () => {
  console.log('MDs', DMMMMM);

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
