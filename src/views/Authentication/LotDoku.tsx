import React, { memo, useRef } from 'react';
import { ActivateKeyboard, Block } from '../../components';
import { useData, useTranslation } from '../../hooks';
import { IoCloseCircle } from 'react-icons/io5';
import { ILotDokuProps } from '../../types/components';


const LotDoku: React.FC<ILotDokuProps> = ({
  inputs,
  setClear,
  inputName,
  setInputName,
  keyboardVisible,
  setKeyboardVisible,
  isChargenNrFocused,
  setIsChargenNrFocused,
}) => {
  const { t } = useTranslation();
  const textInput = useRef<HTMLInputElement>(null);
  const { settings, selectedMethod, lotNumber, setLotNumber } = useData();

  return (
    <>
      <Block
        position="relative"
        align="center"
        marginRight={28}
        marginBottom={keyboardVisible ? -128 : 0}
        marginTop={keyboardVisible && !settings.account.hasUserAuthentification ? 90 : 0}
        transition="all 0.3s "
      >
        <label>Chargennr </label>
        <ActivateKeyboard
          onClick={() => {
            setKeyboardVisible(!keyboardVisible);
            setIsChargenNrFocused(true);
            setTimeout(() => textInput.current?.focus(), 0);
          }}
        />

        <input
          autoFocus
          ref={textInput}
          type="text"
          value={lotNumber|| ''}
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
            setTimeout(() => textInput.current?.focus(), 0);
            setClear(true);
          }}
          style={{
            top: 5,
            zIndex: 100,
            fontSize: 30,
            cursor: 'pointer',
            position: 'absolute',
            transition: 'var(--transition)',
            right:lotNumber&& lotNumber.length > 0 ? 4 : 0,
            visibility: lotNumber&& lotNumber.length > 0 ? 'visible' : 'hidden',
          }}
        />
      </Block>
    </>
  );
};

export default memo(LotDoku);
