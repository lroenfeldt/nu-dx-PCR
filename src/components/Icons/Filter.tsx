import React from "react";
import { useTheme } from "../../hooks";

interface IFilterProps {
  height?: number;
  width?: number;
  color?: string;
}
const Filter: React.FC<IFilterProps> = ({ height = 24, width = 24, color }) => {
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
        d="M11.9996 5.69961V3.59961M11.9996 5.69961C10.8398 5.69961 9.89961 6.63981 9.89961 7.79961C9.89961 8.95941 10.8398 9.89961 11.9996 9.89961M11.9996 5.69961C13.1594 5.69961 14.0996 6.63981 14.0996 7.79961C14.0996 8.95941 13.1594 9.89961 11.9996 9.89961M5.69961 18.2996C6.85941 18.2996 7.79961 17.3594 7.79961 16.1996C7.79961 15.0398 6.85941 14.0996 5.69961 14.0996M5.69961 18.2996C4.53981 18.2996 3.59961 17.3594 3.59961 16.1996C3.59961 15.0398 4.53981 14.0996 5.69961 14.0996M5.69961 18.2996V20.3996M5.69961 14.0996V3.59961M11.9996 9.89961V20.3996M18.2996 18.2996C19.4594 18.2996 20.3996 17.3594 20.3996 16.1996C20.3996 15.0398 19.4594 14.0996 18.2996 14.0996M18.2996 18.2996C17.1398 18.2996 16.1996 17.3594 16.1996 16.1996C16.1996 15.0398 17.1398 14.0996 18.2996 14.0996M18.2996 18.2996V20.3996M18.2996 14.0996V3.59961"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Filter;
