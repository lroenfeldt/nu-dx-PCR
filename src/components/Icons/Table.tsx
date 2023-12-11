import React from "react";
import { useTheme } from "../../hooks";

interface ITableProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  height?: number;
  width?: number;
  color?: string;
}
const Table: React.FC<ITableProps> = ({
  onClick,
  height = 64,
  width = 88,
  color,
}) => {
  const { colors } = useTheme();
  color = color ? color : colors.secondary.main;
  return (
    <svg
      onClick={onClick}
      width={width}
      height={height}
      viewBox="0 0 88 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      cursor="pointer"
    >
      <rect
        width={width}
        height={height}
        rx="8"
        fill={color}
        fillOpacity="0.5"
      />
      <path
        d="M12 5.55556H8C5.79086 5.55556 4 7.14743 4 9.11111V30.4444C4 32.4081 5.79086 34 8 34H28C30.2091 34 32 32.4081 32 30.4444V9.11111C32 7.14743 30.2091 5.55556 28 5.55556H24M12 5.55556C12 7.51923 13.7909 9.11111 16 9.11111H20C22.2091 9.11111 24 7.51923 24 5.55556M12 5.55556C12 3.59188 13.7909 2 16 2H20C22.2091 2 24 3.59188 24 5.55556M18 18H24M18 25.1111H24M12 18H12.02M12 25.1111H12.02"
        stroke="white"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Table;
