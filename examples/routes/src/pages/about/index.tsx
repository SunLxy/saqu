import { useNavigate } from 'react-router';

const About = () => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate('/home');
  };
  return (
    <div>
      <button onClick={onClick}>跳转home</button>
      <input />
    </div>
  );
};
export const element = <About />;
