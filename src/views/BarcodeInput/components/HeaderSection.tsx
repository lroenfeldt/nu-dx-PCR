import { useTranslation } from "../../../hooks";
import { Block, Text } from "../../../components";

const HeaderSection = () => {
	const { t } = useTranslation();
	return (
		<Block inlineFlex column align="flex-start">
			<Text fontSize={"32px"} fontWeight={500} lineHeight="48px">
				{t("barcodeInput.title")}
			</Text>
			<Text p>{t("barcodeInput.instructions1")}</Text>
			<Text p>{t("barcodeInput.instructions2")}</Text>
		</Block>
	);
};

export default HeaderSection;
