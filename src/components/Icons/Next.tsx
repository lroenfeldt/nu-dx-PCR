import React from "react";
import { useTheme } from "../../assets/theme/ThemeContext";
interface INextProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  height?: number;
  width?: number;
  color?: string;
  disabled?: boolean;
}
const Next: React.FC<INextProps> = ({
  onClick,
  height = 104,
  width = 104,
  color,
}) => {
  const { colors } = useTheme();
  color = color ? color : colors.primary.main;
  return (
    <svg
      onClick={onClick}
      width={width}
      height={height}
      viewBox="0 0 104 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_326_1081)">
        <rect
          x="12"
          y="8"
          width="80"
          height="80"
          rx="40"
          fill={color}
          shapeRendering="crispEdges"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M44.1209 27.3002C42.3623 28.1145 41.532 30.2267 42.2688 32.0114C42.4466 32.4422 44.9001 35.0141 50.0803 40.1998L57.6326 47.7601L50.0803 55.3204C44.9001 60.5062 42.4466 63.0781 42.2688 63.5089C41.6698 64.9596 42.1083 66.6687 43.3527 67.734C44.3425 68.5815 45.4112 68.8248 46.611 68.4759C47.4748 68.2247 47.9186 67.8136 56.6134 59.2114C66.3762 49.5527 66.4985 49.4109 66.4985 47.7601C66.4985 46.1133 66.3623 45.955 56.7743 36.4601C50.7668 30.511 47.6155 27.5078 47.1613 27.2985C46.2958 26.8998 44.9839 26.9006 44.1209 27.3002Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_326_1081"
          x="0"
          y="0"
          width="104"
          height="104"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0156863 0 0 0 0 0.105882 0 0 0 0 0.211765 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_326_1081"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_326_1081"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Next;
