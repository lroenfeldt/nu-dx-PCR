import { BsKeyboard } from 'react-icons/bs';
import { IActivateKeyboard } from '../types/interfaces/interfaces';

const ActivateKeyboard = ({ onClick }: IActivateKeyboard) => {
  return (
    <div className="activateKeyboard">
      <BsKeyboard size={30} onClick={onClick} />
    </div>
  );
};

export default ActivateKeyboard;
