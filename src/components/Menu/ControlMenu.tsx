import { useData } from "../../hooks";
import Dialog from "../Modal/Dialog";
import ShutDown from "./ShutDown";

const ControlMenu = () => {
  const { controlMenu, setControlMenu } = useData();

  return (
    <>
      <Dialog visible={controlMenu} setVisible={() => setControlMenu(false)}>
        <ShutDown onClose={() => setControlMenu(false)} />
      </Dialog>
    </>
  );
};

export default ControlMenu;
