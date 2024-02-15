import { TestmethodProps } from "../types/components/index";
import { useData } from "../hooks";
import { useNavigate } from "react-router-dom";

const Testmethod: React.FC<TestmethodProps> = ({ title, status, methodid }) => {
  const navigate = useNavigate();
  const { settings, setSelectedMethod } = useData();

  const selectTest = () => {
    setSelectedMethod(methodid as string);
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
