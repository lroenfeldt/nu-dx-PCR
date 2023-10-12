import React, { useState } from "react";
import { Block, Help, Info, Profil, RightArrow, Text, Update } from "..";
import { useTheme } from "../../hooks";
import MenuNavigator from "./MenuNavigator";
interface MenuItemProps {
  IconComponent: React.FC<any>;
  label: string;
  iconProps?: Record<string | number, string | number>;
  onClick: () => void;
}
enum Menus {
  MAIN = "main",
  HELP = "help",
  PROFIL = "profil",
  SYSTEM = "system",
}
const MenuItem: React.FC<MenuItemProps> = ({
  IconComponent,
  label,
  iconProps = {},
  onClick,
}) => {
  const { colors } = useTheme();

  return (
    <Block
      flex
      align="center"
      gap={8}
      radius={32}
      padding="16px 32px"
      onClick={onClick}
      cursor
      dropShadowSmall
      width={542}
    >
      <IconComponent {...iconProps} color={colors.text.default} />
      <Text style={{ flex: "1 0 0 " }}>{label}</Text>
      <RightArrow color={colors.text.default} />
    </Block>
  );
};

const Menu = ({ onClose }: { onClose: () => void }) => {
  const { colors } = useTheme();
  const [currentMenu, setCurrentMenu] = useState(Menus.SYSTEM);
  const menuItems = [
    {
      IconComponent: Info,
      label: "System",
      iconProps: { height: 26, width: 24 },
      onClick: () => setCurrentMenu(Menus.SYSTEM),
    },
    {
      IconComponent: Profil,
      label: "Profil",
      onClick: () => setCurrentMenu(Menus.PROFIL),
    },
    {
      IconComponent: Help,
      label: "Hilfe",
      onClick: () => setCurrentMenu(Menus.HELP),
    },
    {
      IconComponent: Update,
      label: "Update",
      onClick: () => setCurrentMenu(Menus.MAIN),
    },
  ];

  const navigateBack = () => {
    switch (currentMenu) {
      case Menus.HELP:
        setCurrentMenu(Menus.MAIN);
        break;
      case Menus.PROFIL:
        setCurrentMenu(Menus.MAIN);
        break;
      case Menus.SYSTEM:
        setCurrentMenu(Menus.MAIN);
        break;
      default:
        break;
    }
  };
  return (
    <Block height={"100%"}>
      <Block
        position="fixed"
        right={0}
        top={0}
        radius={16}
        white
        dropShadowLarge
      >
        {/*<Block flex align="center" width={606} padding="24px 32px" borderBottom={`2px solid ${colors.secondary.main}`} white>
					<Block flex align="center" justify="space-between" style={{ flex: "1 0 0" }}>
						<Text h1>Menü</Text>
						<Close onClick={onClose} />
					</Block>
				</Block>*/}
        <Block flex column width={606} padding={32} gap={16} align="flex-start">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </Block>
      </Block>
      <MenuNavigator navigateBack={navigateBack} currentMenu={currentMenu} />
    </Block>
  );
};

export default Menu;
