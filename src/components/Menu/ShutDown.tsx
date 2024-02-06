import { Block, Button } from "..";
import { useTranslation } from "../../hooks";

const ShutDown = () => {
  const { t } = useTranslation();
  return (
    <Block radius={16} white padding={32} marginBottom={100}>
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
