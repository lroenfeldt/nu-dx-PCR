import { Block, Button, Close } from "..";
import { useTranslation } from "../../hooks";

interface IShutDown {
  onClose: () => void;
}
const ShutDown = ({ onClose }: IShutDown) => {
  const { t } = useTranslation();
  return (
    <Block
      position="relative"
      radius={16}
      white
      padding={32}
      marginBottom={100}
    >
      <Block
        position="absolute"
        top={0}
        right={0}
        zIndex={1}
        marginRight={-25}
        marginTop={-25}
        cursor
      >
        <Close onClick={onClose} />
      </Block>
      <Button outlined marginBottom={32} width={"100%"}>
        {t("common.reboot")}
      </Button>
      <Button width={"100%"} outlined>
        {t("common.shutdown")}
      </Button>
    </Block>
  );
};

export default ShutDown;
