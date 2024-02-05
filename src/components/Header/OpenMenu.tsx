import { Menu, Modal } from "..";
import { useData } from "../../hooks";
import { Menus } from "../../types/components";

const OpenMenu = () => {
  const { setCurrentMenu, menuOpen, setMenuOpen, setControlMenu } = useData();

  const closeBoth = () => {
    setCurrentMenu(Menus.MAIN);
    setControlMenu(false);
    setMenuOpen(false);
  };

  return (
    <>
      {menuOpen ? (
        <Modal
          style={{ top: 62, width: "100%", height: "100%", left: 0 }}
          isVisible={menuOpen}
          setIsVisible={closeBoth}
        >
          <Menu />
        </Modal>
      ) : null}
    </>
  );
};

export default OpenMenu;
