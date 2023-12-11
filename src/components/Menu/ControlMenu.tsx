import { Modal } from "..";
import { useData } from "../../hooks";
import ShutDown from "./ShutDown";

const ControlMenu = () => {
  const { controlMenu, setControlMenu } = useData();

  return (
    <>
      {controlMenu ? (
        <Modal
          style={{
            right: 0,
            top: -62,
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            backdropFilter: "blur(0px)",
            WebkitBackdropFilter: "blur(0px)",
          }}
          isVisible={controlMenu}
          setIsVisible={() => setControlMenu(false)}
        >
          <ShutDown />
        </Modal>
      ) : null}
    </>
  );
};

export default ControlMenu;
