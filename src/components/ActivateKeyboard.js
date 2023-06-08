import React from 'react';
import { BsKeyboard } from 'react-icons/bs';
const ActivateKeyboard = ({ onClick }) => {
  return (
    <div className="activateKeyboard">
      <BsKeyboard size={30} onClick={onClick} />
    </div>
  );
};

export default ActivateKeyboard;
