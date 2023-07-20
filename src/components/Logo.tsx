import { useNavigate, useLocation } from 'react-router-dom';
import logo_small from '../img/logo_small.png';

const Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    location.pathname !== '/selectMethod' && (
      <div className="logoWrapper" onDoubleClick={() => navigate('/debug')}>
        <img src={logo_small} alt="" />
        <span>nu:dx PCR</span>
      </div>
    )
  );
};

export default Logo;
