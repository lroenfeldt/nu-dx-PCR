import { useData } from "../hooks";
import { useNavigate } from "react-router-dom";
import { TestmethodProps } from "../types/interfaces/interfaces";
import { useCallback, useEffect, useState } from "react";

const Testmethod: React.FC<TestmethodProps> = ({ title, status, methodid }) => {
  const navigate = useNavigate();
  const { settings, setSelectedMethod, setTestName } = useData();

  const selectTest = () => {
    setSelectedMethod(methodid as string);
    setTestName(title);
    if (
      settings.account.hasUserAuthentification ||
      settings.account.askForLot
    ) {
      navigate("/enterBarcodes");
      // navigate("/auth");
    } else {
      navigate("/enterBarcodes");
    }
  };

  return (
    <div className={`Testmethod ${status}`} onClick={selectTest}>
      <span>{title as string}</span>
    </div>
  );
};

export default Testmethod;
