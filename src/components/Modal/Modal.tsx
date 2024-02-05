import React, { useEffect, FC } from "react";
import useModalStyle from "./useModalStyle";

interface ModalProps {
  children: JSX.Element;
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  style?: React.CSSProperties;
}
const Modal: FC<ModalProps> = ({
  children,
  isVisible,
  setIsVisible,
  style,
}) => {
  const styles = useModalStyle();
  useEffect(() => {
    let modal = document.getElementById("modal");

    window.onclick = function (event) {
      if (modal && event.target == modal) {
        setIsVisible(false);
      }
    };
  }, [isVisible, setIsVisible]);

  return (
    <div
      id="modal"
      style={{
        ...styles.modal,
        display: isVisible ? "flex" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Modal;
