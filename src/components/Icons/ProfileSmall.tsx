import React from "react";

interface IProfileSmallProps {
  height?: number;
  width?: number;
  fill?: string;
}
const ProfileSmall: React.FC<IProfileSmallProps> = ({
  height = 20,
  width = 20,
  fill,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M17 19V16.6667C17 15.429 16.6312 14.242 15.9749 13.3668C15.3185 12.4917 14.4283 12 13.5 12H6.5C5.57174 12 4.6815 12.4917 4.02513 13.3668C3.36875 14.242 3 15.429 3 16.6667V19"
        stroke={fill}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.99935 8.16667C11.8403 8.16667 13.3327 6.67428 13.3327 4.83333C13.3327 2.99238 11.8403 1.5 9.99935 1.5C8.1584 1.5 6.66602 2.99238 6.66602 4.83333C6.66602 6.67428 8.1584 8.16667 9.99935 8.16667Z"
        stroke={fill}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProfileSmall;
