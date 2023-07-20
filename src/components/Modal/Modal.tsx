import { useData, useTranslation } from '../../hooks';
import './css/style.css';
import { Oval } from 'react-loader-spinner';

interface ModalProp {
  children: JSX.Element;
}

const Modal = ({ children }: ModalProp) => {
  const { isModal, setIsModal }: any = useData();
  const { t }: any = useTranslation();
  return (
    <div className="modal" style={{ display: isModal ? 'block' : 'none' }}>
      <div className="modal-header"></div>
      <div className="modal-content">
        <div className="spinnerContainer">
          <Oval height="100" width="100" color="var(--primary)" />
        </div>
        <>{children}</>
      </div>
      <div className="modal-footer"></div>
    </div>
  );
};

export default Modal;
