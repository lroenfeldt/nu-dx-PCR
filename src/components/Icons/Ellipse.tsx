import React from "react";
import { useTheme } from "../../assets/theme/ThemeContext";
interface IEllipseProps {
	onClick?: React.MouseEventHandler<SVGSVGElement>;
	height?: number;
	width?: number;
	color?: string;
}
const Ellipse: React.FC<IEllipseProps> = ({ onClick, height = 32, width = 32, color }) => {
	const { colors } = useTheme();
	color = color || colors.success.main;
	return (
		<svg onClick={onClick} width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
			<circle id="Ellipse 2" cx="16" cy="16" r="16" fill={color} />
		</svg>
	);
};

export default Ellipse;
