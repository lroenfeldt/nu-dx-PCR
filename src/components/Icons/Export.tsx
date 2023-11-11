import React from "react";
import { useTheme } from "../../hooks";

interface IExportProps {
  height?: number;
  width?: number;
  color?: string;
}
const Export: React.FC<IExportProps> = ({ height = 26, width = 26, color }) => {
  const { colors } = useTheme();
  color = colors.white.main;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      viewBox="0 0 26 26"
      fill="none"
    >
      <path
        d="M8.11111 6.125H4.44444C3.09442 6.125 2 7.35622 2 8.875V21.25C2 22.7688 3.09442 24 4.44444 24H21.5556C22.9056 24 24 22.7688 24 21.25V8.875C24 7.35622 22.9056 6.125 21.5556 6.125H17.8889M16.6667 11.625L13 15.75M13 15.75L9.33333 11.625M13 15.75L13 2"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Export;
