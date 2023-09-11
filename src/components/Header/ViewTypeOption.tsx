import React from "react";
import { useTranslation } from "../../hooks";
import { Block, Text } from "..";
import { useTheme } from "../../assets/theme";

interface ViewTypeOptionProps {
	icon: React.ReactNode;
	labelKey: string;
	isActive: boolean;
	onClick: () => void;
}

const ViewTypeOption: React.FC<ViewTypeOptionProps> = ({ icon, labelKey, isActive, onClick }) => {
	const { colors } = useTheme();
	const { t } = useTranslation();

	return (
		<Block
			onClick={onClick}
			background={isActive}
			bgColor={isActive ? colors.white.main : " rgba(6, 43, 86, 0.50)"}
			flex
			row
			center
			cursor
			column
			align="flex-start"
			height={64}
			width={210}
			padding={"14px 24px"}
			gap={8}
			radius={"8px 8px 0px 0px"}>
			<Block flex align="center" gap={16}>
				{icon}
				<Block borderBottom={isActive ? `3px solid ${colors.secondary.main}` : ""}>
					<Text p color={isActive ? colors.secondary.main : colors.white.main} fontSize="28px" fontStyle="normal" fontWeight={600} lineHeight="48px">
						{t(labelKey)}
					</Text>
				</Block>
			</Block>
		</Block>
	);
};

export default ViewTypeOption;
