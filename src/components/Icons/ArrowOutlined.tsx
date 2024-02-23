import React from "react";
import { useTheme } from "../../hooks";

interface IArrowProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  height?: number;
  width?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}
const ArrowOutlined: React.FC<IArrowProps> = ({
  height = 26,
  width = 13.427,
  onClick,
  color,
  style,
  className,
}) => {
  const { colors } = useTheme();
  color = colors.primary.main;
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 16 26"
      fill="none"
      style={style}
      className={className}
    >
      <path
        d="M12.4266 8.72727C12.4266 8.76624 12.4229 8.7954 12.417 8.81808H1.00942C1.00369 8.79548 1 8.76632 1 8.72727C1 8.6323 1.02181 8.59569 1.04172 8.56981L6.71321 1.19687L12.3841 8.56907C12.405 8.59628 12.4266 8.63331 12.4266 8.72727Z"
        stroke={color}
        strokeWidth={2}
      />
      <path
        d="M12.5873 14.1821H0.839224C0.611806 14.1821 0.415203 14.2901 0.249094 14.5058C0.0829855 14.7217 0 14.9773 0 15.2728C0 15.5682 0.0829855 15.824 0.249094 16.0398L6.12315 23.676C6.28945 23.8919 6.48605 24 6.71328 24C6.94052 24 7.1373 23.8919 7.30327 23.676L13.1773 16.0398C13.3433 15.824 13.4266 15.5682 13.4266 15.2727C13.4266 14.9773 13.3433 14.7217 13.1773 14.5057C13.0114 14.2898 12.8146 14.1821 12.5873 14.1821Z"
        fill={color}
      />
    </svg>
  );
};

export default ArrowOutlined;
