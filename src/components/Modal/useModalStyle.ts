import { CSSProperties } from "react";

const useModalStyle = () => {
  const modal: CSSProperties = {
    display: "flex",
    position: "fixed",
    zIndex: 2,
    left: 0,
    top: 62,
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
  };

  const modalContent: CSSProperties = {
    position: "fixed",
    top: "50%",
    padding: "50px",
    transform: "translateY(-50%)",
    borderRadius: "25px",
    backgroundColor: "#fefefe",
    width: "100%",
    animationName: "slideIn",
    animationDuration: "0.4s",
    transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  };

  const modalHeader: CSSProperties = {
    color: "white",
  };

  const modalBody: CSSProperties = {
    padding: "2px 16px",
  };

  const modalFooter: CSSProperties = {
    color: "white",
  };

  return {
    modal,
    modalContent,
    modalHeader,
    modalBody,
    modalFooter,
  };
};

export default useModalStyle;
