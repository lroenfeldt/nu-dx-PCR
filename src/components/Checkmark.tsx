import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import { ICheckmark } from "../types/interfaces/interfaces";
import { useData } from "../hooks";

const Checkmark = ({ barcode, style, testmethod }: ICheckmark) => {
  const { isNinetySix } = useData();
  return testmethod.controlSamples.map((sample, index) => {
    const position = isNinetySix ? sample.position96 : sample.position16;
    if (
      (position == barcode?.label || sample.label == barcode?.label) &&
      sample.expectedResult == barcode?.result
    ) {
      return (
        <div
          key={index}
          className={`checkmark`}
          style={{
            backgroundColor: "var(--green)",
            ...style,
          }}
        >
          <IoCheckmarkSharp
            style={{
              fontSize: "smaller",
            }}
          />
        </div>
      );
    } else if (
      (position == barcode?.label || sample.label == barcode?.label) &&
      sample.expectedResult !== barcode?.result
    ) {
      return (
        <div
          key={index}
          className={`checkmark`}
          style={{
            backgroundColor: "var(--red)",
            ...style,
          }}
        >
          <IoClose />
        </div>
      );
    }
  });
};

export default Checkmark;
