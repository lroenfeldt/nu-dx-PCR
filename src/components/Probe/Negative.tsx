import React from "react";
import Close from "../Icons/Close";
import Ellipse from "../Icons/Ellipse";
import { Block, Minus } from "..";
import { useTheme } from "../../assets/theme";
const Negative = () => {
	const { colors } = useTheme();
	return (
		<Block flex center column padding={8} align="center" gap={8} position="absolute" right={-10} bottom={-20}>
			<Ellipse width={44} height={44} color={colors.test.negative} />
			<Block position="absolute" top={20}>
				<Minus />
			</Block>
		</Block>
	);
};

export default Negative;
