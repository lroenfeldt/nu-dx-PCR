import React, { useEffect, FC } from "react";
import useDialogStyle from "./useDialogStyle";

interface DialogProps {
  children: JSX.Element;
  visible?: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  style?: React.CSSProperties;
}

const Dialog: FC<DialogProps> = ({ children, visible, setVisible }) => {
  const styles = useDialogStyle();

  useEffect(() => {
    let dialog: HTMLDialogElement | null = document.getElementById(
      "dialog"
    ) as HTMLDialogElement | null;

    window.onclick = (event) => {
      if (dialog && event.target == dialog) {
        setVisible(false);
      }
    };
  }, [visible, setVisible]);

  return (
    <dialog
      style={{
        ...styles.dialog,
        display: visible ? "flex" : "none",
      }}
      id="dialog"
    >
      {children}
    </dialog>
  );
};

export default Dialog;
