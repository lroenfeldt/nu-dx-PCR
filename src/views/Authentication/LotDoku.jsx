import React, { useRef } from 'react';
import { ActivateKeyboard, Block, CustomSelect } from '../../components';
import { useData, useTranslation } from '../../hooks';
import { IoCloseCircle } from 'react-icons/io5';
const LotDoku = ({ setKeyboardVisible, keyboardVisible, setClear }) => {
  const { t } = useTranslation();
  const textInput = useRef(null);
  const { settings, selectedMethod, lotNumber, setLotNumber } = useData();
  return (
    <>
      {/*<CustomSelect options={['Lot', 'Doku']} defaultValue="" onChange={(value) => console.log(value)} />*/}
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
          }}
        />

        <input
          autoFocus
          ref={textInput}
          type="text"
          value={lotNumber}
          onChange={(e) => {
            setLotNumber(e.target.value);
          }}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />

        <IoCloseCircle
          onClick={() => {
            setLotNumber('');
            textInput.current.focus();
            setClear(true);
          }}
          style={{
            top: 5,
            zIndex: 100,
            fontSize: 30,
            cursor: 'pointer',
            position: 'absolute',
            transition: 'var(--transition)',
            right: lotNumber.length > 0 ? 4 : 0,
            visibility: lotNumber.length > 0 ? 'visible' : 'hidden',
          }}
        />
      </Block>
    </>
  );
};

export default LotDoku;
