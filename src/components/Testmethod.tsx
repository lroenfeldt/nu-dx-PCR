import { useData } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { Testprocedure } from '../types/interfaces/settings';

const Testmethod = ({ title, status, methodid }: Testprocedure) => {
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
