import { FC } from "react";
import { useTheme } from "../../assets/theme/ThemeContext";

interface AlertRoundedProps {
  color?: string;
  width?: string | number;
  height?: string | number;
}

const AlertRounded: FC<AlertRoundedProps> = ({
  color,
  width = "4px",
  height = "16px",
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <svg
      width={width}
      height={height}
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 4 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={"none"}
        d="M1.99417 1.5L1.99414 10M2.00592 14.5H1.99414"
        stroke={colors.error.main}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AlertRounded;
