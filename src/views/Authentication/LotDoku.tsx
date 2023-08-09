import { memo, useRef } from 'react';
import { ActivateKeyboard, Block } from '../../components';
import { useData } from '../../hooks';
import { IoCloseCircle } from 'react-icons/io5';
import { ILotDoku, ITextInput } from '../../types/interfaces/interfaces';

const LotDoku = ({
  inputs,
  setClear,
  inputName,
  setInputName,
  keyboardVisible,
  setKeyboardVisible,
  isChargenNrFocused,
  setIsChargenNrFocused,
}: ILotDoku) => {
  const textInput: ITextInput = useRef(null) as ITextInput;
  const { settings, selectedMethod, lotNumber, setLotNumber } = useData();
  return (
    <>
      <Block
        align={'center'}
        children={
          <>
            <label>Chargennr </label>
            <ActivateKeyboard
              onClick={() => {
                setKeyboardVisible(!keyboardVisible);
                setIsChargenNrFocused(true);
                setTimeout(() => textInput.current.focus(), 0);
              }}
            />

            <input
              autoFocus
              ref={textInput}
              type="text"
              value={lotNumber as string}
              onChange={(e) => {
                setLotNumber(e.target.value);
              }}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              onFocus={() => {
                setInputName('lotNumber');
                setIsChargenNrFocused(true);
              }}
            />

            <IoCloseCircle
              onClick={() => {
                setLotNumber('');
                setTimeout(() => textInput.current.focus(), 0);
                setClear(true);
              }}
              style={{
                top: 5,
                zIndex: 100,
                fontSize: 30,
                cursor: 'pointer',
                position: 'absolute',
                transition: 'var(--transition)',
                right: lotNumber ? 4 : 0,
                visibility: lotNumber ? 'visible' : 'hidden',
              }}
            />
          </>
        }
        position={'relative'}
        marginTop={keyboardVisible && !settings.account.hasUserAuthentification ? 90 : 0}
        marginRight={28}
        marginBottom={keyboardVisible ? -128 : 0}
        transition={'all 0.3s'}
      />
    </>
  );
};

export default memo(LotDoku);
