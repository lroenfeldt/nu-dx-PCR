import { useData } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { ITestMethod } from '../types/interfaces/interfaces';

interface TestmethodProps {
  title: string;
  status: string;
  methodid: string | number;
}

const Testmethod: React.FC<TestmethodProps> =  ({ title, status, methodid }) => {
  const navigate = useNavigate();
  const { settings, setSelectedMethod } = useData();

  const selectTest = () => {
    setSelectedMethod(methodid as string);
    if (settings.account.hasUserAuthentification || settings.account.askForLot) {
      navigate('/auth');
    } else {
      navigate('/enterBarcodes');
    }
  };

  return (
    <div className={`Testmethod ${status}`} onClick={() => selectTest()}>
      <span>{title as string}</span>
    </div>
  );
};

export default Testmethod;
