import { useData } from '../hooks';
import { useNavigate } from 'react-router-dom';

interface TestmethodProps {
  title: string;
  status?: string;
  methodid: any;
  testrun: any;
  testDuration: any;
  setRemTime: any;
  setErrors: any;
  demo: any;
}
const Testmethod = ({ title, status, methodid }: TestmethodProps) => {
  const navigate = useNavigate();
  const { settings, setSelectedMethod }: any = useData();

  const selectTest = () => {
    setSelectedMethod(methodid);
    if (settings.account.hasUserAuthentification || settings.account.askForLot) {
      navigate('/auth');
    } else {
      navigate('/enterBarcodes');
    }
  };

  return (
    <div className={`Testmethod ${status}`} onClick={() => selectTest()}>
      <span>{title}</span>
    </div>
  );
};

export default Testmethod;
