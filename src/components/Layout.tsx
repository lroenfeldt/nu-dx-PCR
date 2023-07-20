import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import Errors from './Errors';
import { useData } from '../hooks';
import ShutdownNotification from './ShutdownNotification';

interface LayoutProp {
  children: JSX.Element;
}

export default function Layout({ children }: LayoutProp) {
  const location = useLocation();
  const { demo }: any = useData;

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
