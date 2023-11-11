import React, { FC } from "react";
import { useTheme } from "../../assets/theme/ThemeContext";

interface IClosingIconProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  height?: number;
  width?: number;
  color?: string;
  style?: React.CSSProperties;
}
const ClosingIcon: FC<IClosingIconProps> = ({
  onClick,
  height = 30,
  width = 30,
  color,
  style,
}) => {
  const { colors } = useTheme();
  color = color || colors.primary.main;
  return (
    <svg
      onClick={onClick}
      style={style}
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 26.75L27 2.75M3 2.75L27 26.75"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClosingIcon;
