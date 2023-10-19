import React from "react";
import { useTheme } from "../../assets/theme/ThemeContext";
interface IPrevProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  height?: number;
  width?: number;
  color?: string;
  disabled?: boolean;
}
const Prev: React.FC<IPrevProps> = ({
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
      cursor="pointer"
    >
      <g filter="url(#filter0_d_326_1083)">
        <rect
          x="92"
          y="88"
          width="80"
          height="80"
          rx="40"
          transform="rotate(-180 92 88)"
          fill={color}
          shapeRendering="crispEdges"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M59.8791 68.6998C61.6377 67.8855 62.468 65.7733 61.7312 63.9886C61.5534 63.5578 59.0999 60.9859 53.9197 55.8002L46.3674 48.2399L53.9197 40.6796C59.0999 35.4938 61.5534 32.9219 61.7312 32.4911C62.3302 31.0404 61.8917 29.3313 60.6473 28.266C59.6575 27.4185 58.5888 27.1752 57.389 27.5241C56.5252 27.7753 56.0814 28.1864 47.3866 36.7886C37.6238 46.4473 37.5015 46.5891 37.5015 48.2399C37.5015 49.8867 37.6377 50.045 47.2257 59.5399C53.2332 65.489 56.3845 68.4922 56.8387 68.7015C57.7042 69.1002 59.0161 69.0994 59.8791 68.6998Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_326_1083"
          x="0"
          y="0"
          width={width}
          height={height}
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
            result="effect1_dropShadow_326_1083"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_326_1083"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default Prev;
