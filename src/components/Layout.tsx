import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import Errors from './Errors';
import { useData } from '../hooks';
import ShutdownNotification from './ShutdownNotification';
import { IChildren } from '../types/interfaces/interfaces';

export default function Layout({ children }: IChildren) {
  const location = useLocation();
  const { demo } = useData();

  return (
    <div className="App">
      <Header />
      <ShutdownNotification />
      {!demo && <Errors />}
      <div className={location.pathname == '/selectMethod' ? '' : 'Main'}>{children}</div>
      <Footer />
    </div>
  );
}
