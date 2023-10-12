import { FC } from "react";
import Keyboard from "../../../components/Keyboard";
import { useData } from "../../../hooks";
import { IBarcodeKeyboardProps } from "../../../types/interfaces/views";

const BarcodeKeyboard: FC<IBarcodeKeyboardProps> = ({
  active,
  nextWell,
  getBarcode,
  inputs,
  inputName,
  onKeyPress,
  setInputs,
  clear,
  setClear,
  keyboardActive,
  setKeyboardActive,
}) => {
  const numberRegex = new RegExp("^[0-9]+$");
  const { settings } = useData();
  return (
    <Keyboard
      onPrev={() => nextWell(false)}
      onNext={() => nextWell(true)}
      barcode={getBarcode(active)}
      inputs={inputs}
      inputName={inputName}
      onChange={(e: string) => onKeyPress(e)}
      setInputs={setInputs}
      clear={clear}
      setClear={setClear}
      visible={keyboardActive}
      setVisible={setKeyboardActive}
      inputValue={getBarcode(active)?.value}
      isNumeric={numberRegex.test(settings.account.allowedCharacters)}
    />
  );
};

export default BarcodeKeyboard;
