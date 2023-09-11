import React from "react";
import { useTheme } from "../../hooks";
interface RightArrowProps {
	width?: number;
	height?: number;
	color?: string;
	onClick?: React.MouseEventHandler<SVGSVGElement>;
}
const RightArrow: React.FC<RightArrowProps> = ({ width = 14, height = 24, color, onClick }) => {
	const { colors } = useTheme();
	color = color || colors.primary.main;
	return (
		<svg onClick={onClick} width={width} height={height} viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2.63066 23.8976C2.9502 23.8013 3.31983 23.4475 8.35395 18.4195C13.2624 13.5171 13.7476 13.0126 13.871 12.6831C14.0431 12.2237 14.043 11.7468 13.8708 11.2876C13.7473 10.9583 13.263 10.4546 8.38797 5.58561C4.51102 1.71345 2.96544 0.212408 2.76731 0.127005C2.34378 -0.0555515 1.61683 -0.0391521 1.2017 0.162331C0.221209 0.63833 -0.200749 1.81798 0.271152 2.76383C0.378692 2.97953 1.73209 4.38 4.87416 7.52733L9.3248 11.9854L4.87416 16.4434C1.82582 19.4968 0.373362 20.9983 0.264319 21.2089C0.136899 21.4549 0.104856 21.6256 0.1039 22.0629C0.102875 22.5491 0.126172 22.651 0.314673 22.9852C0.569036 23.4362 0.973916 23.7643 1.45046 23.9058C1.88137 24.0338 2.18575 24.0317 2.63066 23.8976Z"
				fill={color}
			/>
		</svg>
	);
};

export default RightArrow;
