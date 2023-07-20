import { BsKeyboard } from 'react-icons/bs';

interface ActivateKeyboardProp {
  onClick: () => void;
}
const ActivateKeyboard = ({ onClick }: ActivateKeyboardProp) => {
  return (
    <div className="activateKeyboard">
      <BsKeyboard size={30} onClick={onClick} />
    </div>
  );
};

export default ActivateKeyboard;
