import { useData } from '../hooks';
import { useNavigate, useLocation } from 'react-router-dom';
export default Logo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    location.pathname !== '/selectMethod' && (
      <div className="logoWrapper" onDoubleClick={() => navigate('/debug')}>
        <img src={logo_small} alt="" />
        <span>PhoenixDx POC</span>
      </div>
    )
  );
};
