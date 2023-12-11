import { useNavigate } from "react-router-dom";
import { Block, Settings } from "..";
import { useData } from "../../hooks";
import { Menus } from "../../types/components";
import { Table } from "../Icons";

const RightButtons = () => {
  const navigate = useNavigate();
  const { menuOpen, setMenuOpen, setCurrentMenu, setControlMenu } = useData();
  const closeMenuOpenResults = () => {
    setMenuOpen(false);
    setCurrentMenu(Menus.MAIN);
    navigate("/ResultList");
  };
  const openMenu = () => {
    setMenuOpen(true);
  };
  const closeBoth = () => {
    setCurrentMenu(Menus.MAIN);
    setControlMenu(false);
    setMenuOpen(false);
  };

  return (
    <Block flex align="flex-start" alignSelf="baseline" gap={12}>
      <Table
        onClick={() => {
          menuOpen ? closeMenuOpenResults() : navigate("/ResultList");
        }}
      />
      <Settings onClick={() => (!menuOpen ? openMenu() : closeBoth())} />
    </Block>
  );
};

export default RightButtons;
