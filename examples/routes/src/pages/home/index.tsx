import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/about');
  };

  return (
    <div>
      <button onClick={onClick}>跳转about</button>
      <input />
    </div>
  );
};
export const element = <Home />;
