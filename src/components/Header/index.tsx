import Power from "../Icons/Power";
import Settings from "../Icons/Settings";
import Open from "../Icons/Open";
import Back from "../Icons/Back";
import { useTranslation, useData, useBackgroundProcesses } from "../../hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { Block, List, Menu, Modal, Proben, Text } from "..";
import { useTheme } from "../../assets/theme";
import ViewTypeOption from "./ViewTypeOption";
import { Menus } from "../../types/components";
import ControlMenu from "../controlMenu";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    viewType,
    setViewType,
    setCurrentMenu,
    menuOpen,
    setMenuOpen,
    controlMenu,
    setControlMenu,
  } = useData();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const closeBoth = () => {
    setCurrentMenu(Menus.MAIN);
    setMenuOpen(false);
  };

  const closeMenuOpenResults = () => {
    setMenuOpen(false);
    setControlMenu(false);
    setCurrentMenu(Menus.MAIN);
    navigate("/ResultList");
  };

  const openMenu = () => {
    setControlMenu(false);
    setMenuOpen(true);
  };

  const openControlMenu = () => {
    setMenuOpen(false);
    setCurrentMenu(Menus.MAIN);
    setControlMenu(true);
  };

  useBackgroundProcesses();
  return (
    <Block
      flex
      row
      padding="0 24px"
      justify="space-between"
      align="center"
      secGrad
      height="64px"
    >
      <Block
        flex
        align="center"
        gap={11}
        padding="8px 26px"
        center
        bgColor={
          location.pathname === "/selectMethod" ? null : colors.secondary.focus
        }
      >
        {location.pathname === "/selectMethod" ? null : (
          <>
            <Block
              align="center"
              flex
              gap={11}
              center
              onClick={() => window.history.back()}
              style={{ cursor: "pointer" }}
            >
              <Back />
              <Text
                p
                white
                fontSize="28px"
                fontStyle="normal"
                fontWeight={600}
                lineHeight="48px"
                style={{ cursor: "pointer" }}
              >
                {t("common.back")}
              </Text>
            </Block>
          </>
        )}
      </Block>
      {location.pathname === "/ViewResults" && (
        <Block flex align="flex-start">
          <ViewTypeOption
            icon={
              <Proben
                color={
                  viewType === "sample"
                    ? colors.secondary.main
                    : colors.white.main
                }
              />
            }
            labelKey="common.samples"
            isActive={viewType === "sample"}
            onClick={() => setViewType("sample")}
          />
          <ViewTypeOption
            icon={
              <List
                color={
                  viewType === "list"
                    ? colors.secondary.main
                    : colors.white.main
                }
              />
            }
            labelKey="common.list"
            isActive={viewType === "list"}
            onClick={() => setViewType("list")}
          />
        </Block>
      )}
      <Block flex align="flex-start" alignSelf="baseline" gap="12px">
        <Open
          onClick={() => {
            menuOpen || controlMenu
              ? closeMenuOpenResults()
              : navigate("/ResultList");
          }}
        />
        <Settings onClick={() => (!menuOpen ? openMenu() : closeBoth())} />
        <Power
          onClick={() =>
            !controlMenu ? openControlMenu() : setControlMenu(false)
          }
        />
      </Block>
      <Modal isVisible={controlMenu} setIsvisible={() => setControlMenu(false)}>
        <ControlMenu onClose={() => setControlMenu(false)} />
      </Modal>
      <Modal isVisible={menuOpen} setIsvisible={() => closeBoth()}>
        <Menu onClose={() => setMenuOpen(false)} />
      </Modal>
    </Block>
  );
};

export default Header;
