import MDS from './hm.md';
const Child = MDS.components.demo;
const Home = () => {
  console.log('MDS', MDS);
  return (
    <div>
      Home
      <Child />
    </div>
  );
};
export default Home;
