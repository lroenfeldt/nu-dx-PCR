import { IoClose, IoCheckmarkSharp } from "react-icons/io5";
import { ICheckmark } from "../types/components";

const Checkmark = ({ barcode, style, testmethod }: ICheckmark) => {
  testmethod.controlSamples.map((sample, index) => {
    if (sample.expectedResult == barcode.result) {
      return (
        <div
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
    } else
      return (
        <div
          className={`checkmark`}
          style={{
            backgroundColor: "var(--red)",
            ...style,
          }}
        >
          <IoClose />
        </div>
      );
  });
};

export default Checkmark;
