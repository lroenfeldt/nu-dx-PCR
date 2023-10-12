import { useState } from "react";
import { ImArrowRight2, ImArrowLeft2 } from "react-icons/im";
import { IScrollController } from "../types/interfaces/interfaces";

const ScrollController = ({ onClick, disabled }: IScrollController) => {
  const [_direction, setDirection] = useState("next");

  return (
    <div className="controller">
      <div
        className="prev"
        onClick={() => {
          onClick(false);
          setDirection("prev");
        }}
      >
        <ImArrowLeft2 />
      </div>
      <div
        className={"next "}
        style={{ opacity: !disabled ? 1 : 0.5 }}
        onClick={() => {
          !disabled && setDirection("next");
          !disabled && onClick(true);
        }}
      >
        <ImArrowRight2 />
      </div>
    </div>
  );
};

export default ScrollController;
