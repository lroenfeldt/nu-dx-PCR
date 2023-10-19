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

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { viewType, setViewType, setCurrentMenu, menuOpen, setMenuOpen } =
    useData();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const closeBoth = () => {
    setCurrentMenu(Menus.MAIN);
    setMenuOpen(false);
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
        cursor
        onClick={() => window.history.back()}
      >
        <Back />
        <Text
          p
          white
          fontSize="28px"
          fontStyle="normal"
          fontWeight={600}
          lineHeight="48px"
        >
          {t("common.back")}
        </Text>
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
        <Open onClick={() => navigate("/ResultList")} />
        <Settings
          onClick={() => {
            !menuOpen ? setMenuOpen(true) : closeBoth();
          }}
        />
        <Power />
      </Block>
      <Modal isVisible={menuOpen} setIsvisible={() => closeBoth()}>
        <Menu onClose={() => setMenuOpen(false)} />
      </Modal>
    </Block>
  );
};

export default Header;
