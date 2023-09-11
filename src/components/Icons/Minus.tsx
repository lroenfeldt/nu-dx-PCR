import React from "react";
import { useTheme } from "../../hooks";

interface MinusProps {
	onClick?: () => void;
	width?: number | string;
	height?: number | string;
	color?: string;
}
const Minus: React.FC<MinusProps> = ({ onClick, width = 28, height = 6, color, ...rest }) => {
	const { colors } = useTheme();
	color = color || colors.white.main;
	return (
		<svg onClick={onClick} width={width} height={height} {...rest} viewBox="0 0 28 6" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M0.556625 4.43178C0.0935491 3.63258 0.0872469 2.38835 0.542266 1.58675C0.714948 1.2825 1.25491 0.748192 1.55587 0.583746C2.12498 0.272832 2.16212 0.270934 7.83951 0.265061L11.2593 0.259438L16.7407 0.259439L20.1604 0.265062C25.8378 0.270935 25.875 0.272831 26.4441 0.583745C26.7537 0.752883 27.2597 1.25156 27.4433 1.56845C27.9131 2.37911 27.9131 3.62112 27.4433 4.43178C27.2597 4.74867 26.7537 5.24735 26.4441 5.41648C25.875 5.7274 25.8378 5.7293 20.1604 5.73517L16.7407 5.74079L11.2593 5.74079L7.83951 5.73517C2.16212 5.7293 2.12498 5.7274 1.55587 5.41648C1.24628 5.24735 0.74023 4.74868 0.556625 4.43178Z"
				fill={color}
			/>
		</svg>
	);
};

export default Minus;
