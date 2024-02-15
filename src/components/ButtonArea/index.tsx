import React from "react";
import { ButtonAreaProps } from "../../types/components/index";

const ButtonArea: React.FC<ButtonAreaProps> = ({
  children,
  noborder,
  ...rest
}) => {
  const buttonAreaClass = [noborder && "noborder", "buttonArea"]
    .filter((el) => typeof el !== "undefined" && el !== false)
    .join(" ");

  return (
    <div className={buttonAreaClass} {...rest}>
      {children}
    </div>
  );
};

export default ButtonArea;
