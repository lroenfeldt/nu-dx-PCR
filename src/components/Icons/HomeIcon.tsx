import { FC } from "react";
import { useTheme } from "../../assets/theme/ThemeContext";

interface HomeProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  width?: string | number;
  height?: string | number;
  color?: string;
}

const HomeIcon: FC<HomeProps> = ({
  onClick,
  height = 28,
  width = 17,
  color,
}) => {
  const { colors } = useTheme();
  const colorToUse = color || colors.white.main;

  return (
    <svg
      cursor={"pointer"}
      onClick={onClick}
      width={width}
      height={height}
      viewBox="0 0 28 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={colorToUse}
        d="M2 17.5646L5.24344 14.1058M5.24344 14.1058L16.5955 1.99988L27.9475 14.1058M5.24344 14.1058V31.3999C5.24344 32.355 5.96951 33.1293 6.86516 33.1293H11.7303M27.9475 14.1058L31.191 17.5646M27.9475 14.1058V31.3999C27.9475 32.355 27.2214 33.1293 26.3258 33.1293H21.4606M11.7303 33.1293C12.626 33.1293 13.352 32.355 13.352 31.3999V24.4822C13.352 23.5271 14.0781 22.7528 14.9738 22.7528H18.2172C19.1128 22.7528 19.8389 23.5271 19.8389 24.4822V31.3999C19.8389 32.355 20.565 33.1293 21.4606 33.1293M11.7303 33.1293H21.4606"
      />
    </svg>
  );
};

export default HomeIcon;
