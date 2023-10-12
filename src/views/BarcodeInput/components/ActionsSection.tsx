import { FC } from "react";
import { useTranslation } from "../../../hooks";
import { Button, Block } from "../../../components";
import { useNavigate } from "react-router-dom";
import ErrorBadge from "./ErrorBadge";
import { IActionsSectionProps } from "../../../types/interfaces/views";

const ActionsSection: FC<IActionsSectionProps> = ({
  active,
  barcodesValid,
  getBarcode,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Block inlineFlex gap={32} center align="center">
      {getBarcode(active).error?.length > 0 && (
        <ErrorBadge error={getBarcode(active).error} />
      )}
      <Button
        outlined
        onClick={() => navigate("/selectMethod")}
        disabled={barcodesValid}
      >
        {t("common.cancel")}
      </Button>
      <Button
        center
        onClick={() => navigate("/testReady")}
        disabled={barcodesValid}
      >
        {t("common.testStart")}
      </Button>
    </Block>
  );
};

export default ActionsSection;
