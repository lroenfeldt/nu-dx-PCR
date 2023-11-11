import { FC } from "react";
import { useTheme } from "../../assets/theme/ThemeContext";

interface EmailProps {
  color?: string;
  width?: string | number;
  height?: string | number;
}

const Email: FC<EmailProps> = ({
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
        d="M4.19922 10.2667L11.932 15.9947C12.5904 16.4823 13.4481 16.4823 14.1064 15.9947L21.8392 10.2667M6.15922 22.2444H19.8792C20.9617 22.2444 21.8392 21.2694 21.8392 20.0667V9.17778C21.8392 7.97502 20.9617 7 19.8792 7H6.15922C5.07674 7 4.19922 7.97502 4.19922 9.17778V20.0667C4.19922 21.2694 5.07674 22.2444 6.15922 22.2444Z"
        stroke={colors.text.default}
        strokeWidth="1.67"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Email;
