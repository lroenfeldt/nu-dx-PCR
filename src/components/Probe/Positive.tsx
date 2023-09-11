import Ellipse from "../Icons/Ellipse";
import { Block, Plus } from "..";
import { useTheme } from "../../hooks";
const Positive = () => {
	const { colors } = useTheme();

	return (
		<Block flex center column padding={8} align="center" gap={8} position="absolute" right={-10} bottom={-20}>
			<Ellipse width={44} height={44} color={colors.test.positive} />
			<Block position="absolute" top={16}>
				<Plus />
			</Block>
		</Block>
	);
};

export default Positive;
