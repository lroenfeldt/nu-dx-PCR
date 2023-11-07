import React, { useEffect, FC } from "react";
import useModalTestInfoStyle from "./useModalTestInfo";

interface ModalTestInfoPros {
  children: JSX.Element;
  isVisible: boolean;
  setIsvisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalTestInfo: FC<ModalTestInfoPros> = ({
  children,
  isVisible,
  setIsvisible,
}) => {
  const styles = useModalTestInfoStyle();
  useEffect(() => {
    var modal = document.getElementById("modal");

    window.onclick = function (event) {
      if (modal && event.target == modal) {
        setIsvisible(false);
      }
    };
  }, [isVisible, setIsvisible]);

  return (
    <div
      id="modal"
      style={{
        ...styles.modal,
        display: isVisible ? "flex" : "none",
      }}
    >
      {children}
    </div>
  );
};

export default ModalTestInfo;
