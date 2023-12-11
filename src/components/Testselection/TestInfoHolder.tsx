import TestInfos from "./TestInfos";
import { useData } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { Modal } from "..";

const TestInfoHolder = () => {
  const { settings, info, setInfo } = useData();
  const navigate = useNavigate();
  const selectTest = () => {
    if (
      settings.account.hasUserAuthentification ||
      settings.account.askForLot
    ) {
      navigate("/auth");
    } else {
      navigate("/enterBarcodes");
    }
  };

  return (
    <Modal
      style={{ left: 0, top: 0, width: "100%", height: "100%" }}
      isVisible={info}
      setIsVisible={() => setInfo(false)}
    >
      <TestInfos onClose={() => setInfo(false)} selectTest={selectTest} />
    </Modal>
  );
};

export default TestInfoHolder;
