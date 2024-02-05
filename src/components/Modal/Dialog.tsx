import React, { useEffect, FC } from "react";
import useDialogStyle from "./useDialogStyle";

interface DialogProps {
  children: JSX.Element;
  isVisible?: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  style?: React.CSSProperties;
}

const Dialog: FC<DialogProps> = ({ children, isVisible, setIsVisible }) => {
  const styles = useDialogStyle();

  useEffect(() => {
    let dialog: HTMLDialogElement | null = document.getElementById(
      "dialog"
    ) as HTMLDialogElement | null;

    window.onclick = (event) => {
      if (dialog && event.target == dialog) {
        setIsVisible(false);
      }
    };
  }, [isVisible]);

  return (
    <dialog
      style={{
        ...styles.dialog,
        display: isVisible ? "flex" : "none",
      }}
      id="dialog"
    >
      {children}
    </dialog>
  );
};

export default Dialog;
