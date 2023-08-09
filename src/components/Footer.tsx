import { useState, useEffect } from 'react';
import nuDiagnostics from '../assets/Logos/nu-diagnostics/nu-diagnostics white.png';
import { useData } from '../hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaServer, FaCircle } from 'react-icons/fa';
import { TbMinusVertical } from 'react-icons/tb';

const Footer = () => {
  const { settings, dbConnection } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [stateTime, setStateTime] = useState(new Date().toLocaleString());

  const logo =
    location.pathname === '/selectMethod' ? (
      <div onDoubleClick={() => navigate('/debug')}>
        <img src={nuDiagnostics} alt="" />
      </div>
    ) : (
      <span>{settings.account.data.name || 'Procomcure Biotech'}</span>
    );

  useEffect(() => {
    setInterval(() => setStateTime(new Date().toLocaleString()), 1);
  }, []);

  return (
    <div className="Footer">
      <div className="menu-left">{logo}</div>
      <div className="menu-center">
        <span></span>
      </div>
      <div className="menu-right">
        <span>{stateTime}</span>
        <div>
          <TbMinusVertical color="#fff" size={40} />
        </div>
        <div>
          <FaServer color="#fff" />
        </div>
        <div>
          <FaCircle color={dbConnection ? 'green' : 'red'} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
