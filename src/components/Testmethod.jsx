import React, { useCallback } from 'react';
import { useData } from '../hooks';
import { useNavigate } from 'react-router-dom';
const Testmethod = ({ title, status, methodid }) => {
  const navigate = useNavigate();
  const { settings, setSelectedMethod } = useData();

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
