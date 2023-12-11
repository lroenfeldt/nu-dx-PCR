import React, { FC } from "react";
import { useTheme } from "../../assets/theme/ThemeContext";

interface IBackProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  height?: number;
  width?: number;
  color?: string;
  style?: React.CSSProperties;
}
const Back: FC<IBackProps> = ({
  onClick,
  height = 28,
  width = 17,
  color,
  style,
}) => {
  const { colors } = useTheme();
  const colorToUse = color || colors.white.main;
  return (
    <svg
      onClick={onClick}
      width={width}
      height={height}
      viewBox="0 0 17 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        id="icon error 1 (Traced)"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2642 0.119459C12.8914 0.231849 12.4602 0.644583 6.58706 6.51055C0.86059 12.2301 0.294495 12.8187 0.15054 13.2031C-0.0502473 13.739 -0.0501664 14.2954 0.150701 14.8311C0.294815 15.2154 0.859874 15.803 6.54737 21.4835C11.0705 26.001 12.8737 27.7522 13.1048 27.8518C13.5989 28.0648 14.447 28.0457 14.9313 27.8106C16.0753 27.2553 16.5675 25.879 16.017 24.7755C15.8915 24.5239 14.3126 22.89 10.6468 19.2181L5.4544 14.0171L10.6468 8.81606C14.2032 5.25369 15.8977 3.502 16.025 3.25634C16.1736 2.9693 16.211 2.77019 16.2121 2.25997C16.2133 1.69276 16.1861 1.57383 15.9662 1.1839C15.6695 0.657815 15.1971 0.274972 14.6411 0.109894C14.1384 -0.0394015 13.7833 -0.0369309 13.2642 0.119459Z"
        fill={colorToUse}
      />
    </svg>
  );
};

export default Back;
