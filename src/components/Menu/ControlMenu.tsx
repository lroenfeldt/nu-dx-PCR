import { useData } from "../../hooks";
import Dialog from "../Modal/Dialog";
import ShutDown from "./ShutDown";

const ControlMenu = () => {
  const { controlMenu, setControlMenu } = useData();

  return (
    <>
      <Dialog
        isVisible={controlMenu}
        setIsVisible={() => setControlMenu(false)}
      >
        <ShutDown />
      </Dialog>
    </>
  );
};

export default ControlMenu;
