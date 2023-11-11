import { FC } from "react";
import { useTheme } from "../../assets/theme/ThemeContext";

interface PhoneProps {
  color?: string;
  width?: string | number;
  height?: string | number;
}

const Phone: FC<PhoneProps> = ({
  color,
  width = "26px",
  height = "28px",
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      {...rest}
      viewBox="0 0 26 28"
      fill="none"
    >
      <path
        d="M3.97852 6.37797C3.97852 5.17522 4.85604 4.2002 5.93852 4.2002H9.15217C9.57399 4.2002 9.94849 4.50011 10.0819 4.94475L11.5497 9.8376C11.704 10.3517 11.4945 10.9135 11.0583 11.1559L8.84618 12.3848C9.92638 15.0469 11.8565 17.1915 14.2523 18.3917L15.3584 15.9338C15.5765 15.4491 16.0822 15.2164 16.5448 15.3877L20.9484 17.0187C21.3486 17.1669 21.6185 17.583 21.6185 18.0517V21.6224C21.6185 22.8252 20.741 23.8002 19.6585 23.8002H18.6785C10.5599 23.8002 3.97852 16.4875 3.97852 7.46686V6.37797Z"
        stroke={colors.text.default}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Phone;
