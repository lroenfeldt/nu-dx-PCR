import { useData } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { ITestMethod } from "../../types/interfaces/interfaces";
import Card from "../Card";
import { useCallback } from "react";
import { ITestmethodProps } from "../../types/components";

const Testmethod: React.FC<ITestmethodProps> = ({
  title,
  methodid,
  image,
  openInfos,
}) => {
  const navigate = useNavigate();
  const { settings, setSelectedMethod } = useData();

  const selectTest = useCallback(() => {
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
  }, [
    methodid,
    navigate,
    setSelectedMethod,
    settings.account.askForLot,
    settings.account.hasUserAuthentification,
  ]);

  return (
    <Card
      title={title}
      subTitle={title}
      durationMinutes={
        settings.account.testprocedures.find(
          (test: ITestMethod) => test.id == methodid
        )?.durationMinutes || 0
      }
      infos={""}
      onClick={selectTest}
      image={image}
      openInfos={() => {
        openInfos();
        setSelectedMethod(methodid as string);
      }}
    />
  );
};

export default Testmethod;
