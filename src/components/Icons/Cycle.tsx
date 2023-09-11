import React from "react";
import { useTheme } from "../../assets/theme/ThemeContext";
interface ICycle1Props {
	onClick?: React.MouseEventHandler<SVGSVGElement>;
	height?: number;
	width?: number;
	color?: string;
}
const Cycle: React.FC<ICycle1Props> = ({ onClick, height = 44, width = 44, color, ...rest }) => {
	const { colors } = useTheme();
	color = color || colors.secondary.main;
	return (
		<svg onClick={onClick} width={width} height={height} {...rest} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle cx="22" cy="22" r="20" fill="white" stroke={color} strokeWidth="4" />
		</svg>
	);
};

export default Cycle;
