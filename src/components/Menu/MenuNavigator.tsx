import React from "react";
import { Back, Block, Text } from "..";
import Profil from "./Profil";
import { useTranslation } from "../../hooks";
import Help from "./Help";
import System from "./System";

enum Menus {
  MAIN = "main",
  HELP = "help",
  PROFIL = "profil",
  SYSTEM = "system",
}
interface MenuNavigatorProps {
  navigateBack: () => void;
  currentMenu: Menus;
}

const MenuNavigator: React.FC<MenuNavigatorProps> = ({
  navigateBack,
  currentMenu,
}) => {
  const { t } = useTranslation();

  return (
    <Block
      position="absolute"
      right={0}
      top={0}
      className={currentMenu == Menus.MAIN ? "" : "animate__backInRight"}
    >
      {currentMenu !== Menus.MAIN && (
        <Block
          flex
          align="center"
          gap={8}
          secondary
          padding="16px 32px"
          cursor
          onClick={navigateBack}
          overflow="hiddin"
          position="sticky"
          top={0}
        >
          <Back />
          <Text label white>
            {t("common.back")}
          </Text>
        </Block>
      )}
      {currentMenu !== Menus.MAIN && (
        <Block
          flex
          white
          height={801}
          width={606}
          padding={"40px 24px"}
          justify="space-between"
          align="flex-start"
          alignSelf="stretch"
        >
          {currentMenu === Menus.HELP && <Help />}
          {currentMenu === Menus.PROFIL && <Profil />}
          {currentMenu === Menus.SYSTEM && <System />}
        </Block>
      )}
    </Block>
  );
};

export default MenuNavigator;
