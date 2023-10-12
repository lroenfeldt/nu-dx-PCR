import { Input } from "../../../components";
import { FC, useRef } from "react";
import { useTranslation } from "../../../hooks";
import { IInputComponentProps } from "../../../types/interfaces/views";

const InputComponent: FC<IInputComponentProps> = ({
  active,
  updateBarcode,
  getBarcode,
}) => {
  const textInput = useRef(null);
  const { t } = useTranslation();
  return (
    <Input
      rounded
      autoFocus
      type="text"
      ref={textInput}
      onChange={updateBarcode}
      id={getBarcode(active).label}
      value={getBarcode(active).value}
      placeholder={t("barcodeInput.barcode")}
    />
  );
};

export default InputComponent;
