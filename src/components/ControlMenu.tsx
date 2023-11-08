import { Block, Text } from ".";
import { useTheme, useTranslation } from "../hooks";
import { ControlMenuItemProps } from "../types/components";
import Reboot from "./Icons/Reboot";
import ShutDown from "./Icons/ShutDown";

const ControlMenuItem: React.FC<ControlMenuItemProps> = ({
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
      cursor
      dropShadowSmall
      width={338}
      onClick={onClick}
    >
      <IconComponent {...iconProps} color={colors.text.default} />
      <Text style={{ flex: "1 0 0 " }}>{label}</Text>
    </Block>
  );
};

const ControlMenu = (_props: { onClose: () => void }) => {
  const { t } = useTranslation();
  const menuItems = [
    {
      IconComponent: ShutDown,
      label: t("common.shutdown"),
      iconProps: { height: 26, width: 24 },
      onClick: () => console.log("shutdown"),
    },
    {
      IconComponent: Reboot,
      label: t("common.reboot"),
      iconProps: { height: 26, width: 24 },
      onClick: () => console.log("reboot"),
    },
  ];
  return (
    <Block
      position="fixed"
      right={0}
      top={0}
      white
      dropShadowLarge
      style={{ borderBottomLeftRadius: "16px" }}
    >
      <Block
        flex
        column
        width={402}
        height={208}
        padding={32}
        gap={16}
        align="flex-start"
      >
        {menuItems.map((item, index) => (
          <ControlMenuItem key={index} {...item} />
        ))}
      </Block>
    </Block>
  );
};

export default ControlMenu;
