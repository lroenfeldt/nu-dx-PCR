import { CSSProperties } from "react";

const useDialogStyle = () => {
  const dialog: CSSProperties = {
    display: "flex",
    position: "fixed",
    zIndex: 4,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    background: "rgba(255, 255, 255, 0.25)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    animationName: "fadeIn",
    animationDuration: "0.4s",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
  };

  return {
    dialog,
  };
};

export default useDialogStyle;
