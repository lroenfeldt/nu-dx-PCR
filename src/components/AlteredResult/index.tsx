import { IAlteredResult } from "../../types/components/index";
import { useData } from "../../hooks";
import { hexToRGB } from "../../utils/helper";
import { SlPencil } from "react-icons/sl";

const AlteredResult = ({
  activeBarcode,
  testmethod,
  style,
}: IAlteredResult) => {
  const { settings } = useData();

  if (activeBarcode?.alteredResult)
    return (
      <div
        className="alteredResult"
        style={{
          top: settings.account.changeResults ? 0 : 15,
          backgroundColor:
            activeBarcode?.result == "invalid"
              ? "orange"
              : hexToRGB(
                  testmethod.results.find((result) =>
                    result.name.includes(activeBarcode?.result)
                  )?.color as string,
                  0.9
                ) || "transparent",
          ...style,
        }}
      >
        <SlPencil color="#fff" size={10} />
      </div>
    );
  return null;
};

export default AlteredResult;
