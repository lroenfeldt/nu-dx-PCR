import { FC } from "react";
import { useTheme } from "../../assets/theme/ThemeContext";

interface OpenLidProps {
  color?: string;
  width?: string | number;
  height?: string | number;
}

const OpenLid: FC<OpenLidProps> = ({ color, width = 24, height = 24 }) => {
  const { colors } = useTheme();
  color = color || colors.text.default;

  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      cursor="pointer"
    >
      <rect
        x="1"
        y="1"
        width="21.9956"
        height="22"
        rx="10.9978"
        stroke={color}
        strokeWidth="2"
      />
      1
      <path
        d="M8 10.0542L8 15.7069C8 16.4211 8.43173 17 8.96429 17L15.0357 17C15.5683 17 16 16.4211 16 15.7069L16 10.0542M13.2857 8.72414L12 7M12 7L10.7143 8.72414M12 7L12 12.1724"
        stroke={color}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default OpenLid;
