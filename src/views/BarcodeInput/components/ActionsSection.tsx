import { FC } from "react";
import { useTranslation } from "../../../hooks";
import { Button, Block } from "../../../components";
import { useNavigate } from "react-router-dom";
import { IBarcode } from "../../../types/interfaces/interfaces";
import ErrorBadge from "./ErrorBadge";
interface ActionsSectionProps {
	active: number;
	barcodesValid: boolean;
	getBarcode: (active: number) => IBarcode;
}

const ActionsSection: FC<ActionsSectionProps> = ({ active, barcodesValid, getBarcode }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	return (
		<Block inlineFlex gap={32} center align="center">
			{getBarcode(active).error?.length > 0 && <ErrorBadge error={getBarcode(active).error} />}
			<Button outlined onClick={() => navigate("/selectMethod")} disabled={barcodesValid}>
				{t("common.cancel")}
			</Button>
			<Button center onClick={() => navigate("/testReady")} disabled={barcodesValid}>
				{t("common.testStart")}
			</Button>
		</Block>
	);
};

export default ActionsSection;
