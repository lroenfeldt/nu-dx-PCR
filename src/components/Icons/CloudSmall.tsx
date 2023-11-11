import { FC } from "react";

interface CloudSmall {
  color?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

const CloudSmall: FC<CloudSmall> = ({
  color,
  width = "14px",
  height = "14px",
  ...rest
}) => {
  return (
    <svg
      width={width}
      height={height}
      {...rest}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4.11111 10.8C2.39289 10.8 1 9.5464 1 8C1 6.66506 2.038 5.54832 3.42722 5.26787C3.36576 5.02076 3.33333 4.76379 3.33333 4.5C3.33333 2.567 5.07445 1 7.22222 1C9.1039 1 10.6734 2.20278 11.0335 3.80068C11.0593 3.80023 11.0852 3.8 11.1111 3.8C13.2589 3.8 15 5.367 15 7.3C15 8.99327 13.664 10.4057 11.8889 10.73M10.3333 8.7L8 6.6M8 6.6L5.66667 8.7M8 6.6L8 15"
        stroke="#FFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloudSmall;
