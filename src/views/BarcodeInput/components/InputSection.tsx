import { FC } from "react";
import InputComponent from "./InputComponent";
import { Block, Next, Prev, ActivateKeyboard } from "../../../components";
import { IInputSectionProps } from "../../../types/interfaces/views";

const InputSection: FC<IInputSectionProps> = ({
  active,
  updateBarcode,
  nextWell,
  getBarcode,
  disabled,
  keyboardActive,
  setKeyboardActive,
}) => {
  return (
    <Block inlineFlex gap={53} align="center">
      <ActivateKeyboard onClick={() => setKeyboardActive(!keyboardActive)} />
      <Block flex gap={32} center align="center">
        <Prev onClick={() => nextWell(false)} disabled={disabled} />
        <InputComponent
          active={active}
          updateBarcode={updateBarcode}
          getBarcode={getBarcode}
        />
        <Next onClick={() => nextWell(true)} disabled={disabled} />
      </Block>
    </Block>
  );
};

export default InputSection;
