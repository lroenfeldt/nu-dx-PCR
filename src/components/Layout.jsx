import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import Errors from './Errors';
import { useData, useTranslation } from '../hooks';
import Modal from './Modal/Modal';
import ShutdownNotification from './ShutdownNotification/';

export default function Layout({ children }) {
  const location = useLocation();
  const { demo, settings } = useData;
  const { t } = useTranslation();

  return (
    <div className="App">
      {/*<Modal>
        <h2>{t('common.appUpdate')}...</h2>
      </Modal>*/}
      <Header />
      <ShutdownNotification />
      {!demo && <Errors />}
      <div className={location.pathname == '/selectMethod' ? '' : 'Main'}>{children}</div>
      <Footer />
    </div>
  );
}
