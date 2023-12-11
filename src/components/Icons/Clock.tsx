import React from "react";

interface IClockProps {
  height?: number;
  width?: number;
  fill?: string;
}
const Clock: React.FC<IClockProps> = ({ height = 20, width = 20, fill }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 7.55556V12L15.3333 15.3333M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={fill}
      />
    </svg>
  );
};

export default Clock;
