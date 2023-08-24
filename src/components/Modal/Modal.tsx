import { useData } from '../../hooks';
import { IChildren } from '../../types/interfaces/interfaces';
import './css/style.css';
import { Oval } from 'react-loader-spinner';

const Modal = ({ children }: IChildren) => {
  const { isModal } = useData();
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
