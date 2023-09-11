import React, { useState, useEffect } from 'react';
import nuDiagnostics from '../assets/Logos/nu-diagnostics/nu-diagnostics white.png';
import { useData, useTranslation } from '../hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaServer, FaCircle } from 'react-icons/fa';
import { TbMinusVertical } from 'react-icons/tb';
import moment from 'moment';
import 'moment/dist/locale/de';
import 'moment/dist/locale/fr';

const Footer = () => {
  const { locale } = useTranslation();
  const { settings, dbConnection } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [stateTime, setStateTime] = useState(
    moment().locale(locale).format('LL') + ' ' + moment().locale(locale).format('LTS')
  );

  const logo =
    location.pathname === '/selectMethod' ? (
      <div onDoubleClick={() => navigate('/debug')}>
        <img src={nuDiagnostics} alt="" />
      </div>
    ) : (
      <span>{settings.account.data.name || 'Procomcure Biotech'}</span>
    );

  useEffect(() => {
    const interval = setInterval(() => {
      setStateTime(moment().locale(locale).format('LL') + ' ' + moment().locale(locale).format('LTS'));
      // if (locale == 'de' || locale == 'fr') {
      //   setStateTime(moment().locale(locale).format('LL') + ' ' + moment().locale(locale).format('LTS'));
      // }
      // if (locale == 'en') {
      //   setStateTime(moment().locale(locale).format('LL') + ' ' + moment().locale(locale).format('h:mm:ss'));
      // }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [locale]);

  return (
    <div className="Footer">
      <div className="menu-left">{logo}</div>
      <div className="menu-center">
        <span></span>
      </div>
      <div className="menu-right">
        {/* {locale === 'de' ? <span className="state-time-de">{stateTime}</span> : null}

        {locale === 'en' ? (
          <div className="state-time-en">
            <span>{stateTime}</span>
            <span>pm</span>
          </div>
        ) : null}
        {locale === 'fr' ? <span className="state-time-fr">{stateTime}</span> : null} */}

        {stateTime}
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
