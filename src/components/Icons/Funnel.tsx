import React from "react";
import { useTheme } from "../../hooks";

interface IFunnelProps {
  height?: number;
  width?: number;
  color?: string;
}
const Funnel: React.FC<IFunnelProps> = ({ height = 20, width = 20, color }) => {
  const { colors } = useTheme();
  color = colors.primary.main;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20.6792 16.2852C20.3651 15.9362 19.9651 15.6983 19.5295 15.6016L16.8435 15.0047C15.3716 14.6776 13.8436 14.9049 12.5011 15.6508L12.144 15.8492C10.8014 16.5951 9.27341 16.8224 7.80153 16.4953L5.62831 16.0124C4.89062 15.8485 4.12801 16.105 3.59606 16.6961M7.82253 2H16.8225L15.6975 3.25V9.71447C15.6975 10.3775 15.9346 11.0134 16.3565 11.4822L21.9815 17.7322C23.399 19.3071 22.3951 22 20.3906 22H4.25451C2.24997 22 1.2461 19.3071 2.66352 17.7322L8.28852 11.4822C8.71048 11.0134 8.94753 10.3775 8.94753 9.71447V3.25L7.82253 2Z"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
      />
    </svg>
  );
};

export default Funnel;
