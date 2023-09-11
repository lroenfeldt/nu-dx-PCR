import React from "react";

import { Block, Cycle, Ellipse, CloseIcon } from "..";
import { useTheme } from "../../assets/theme";
interface IInvalidProps {
	cycle?: boolean;
}
const Invalid: React.FC<IInvalidProps> = ({ cycle }) => {
	const { colors } = useTheme();
	return (
		<Block flex center column padding={8} align="center" gap={8} position="absolute" right={-5} bottom={-20}>
			{cycle ? <Cycle /> : <Ellipse width={44} height={44} color={colors.test.positive} />}

			<Block position="absolute" bottom={13} shadow>
				<CloseIcon width={24} height={24} color={cycle ? colors.secondary.main : colors.white.main} />
			</Block>
		</Block>
	);
};

export default Invalid;
