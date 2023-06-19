import React from 'react';
import { ActivateKeyboard, Block, CustomSelect } from '../../components';
import { useData, useTranslation } from '../../hooks';
import { IoCloseCircle } from 'react-icons/io5';
const LotDoku = ({ setKeyboardVisible, keyboardVisible }) => {
  const { t } = useTranslation();
  const { settings, selectedMethod, lotNumber, setLotNumber } = useData();
  return (
    <>
      <h4>{t('authentication.currentLot')}</h4>
      {/*<CustomSelect options={['Lot', 'Doku']} defaultValue="" onChange={(value) => console.log(value)} />*/}
      <Block position="relative">
        <ActivateKeyboard
          onClick={() => {
            setKeyboardVisible(!keyboardVisible);
          }}
        />
        <input
          type="text"
          placeholder={t('authentication.currentLot')}
          value={lotNumber}
          onChange={(e) => setLotNumber(e.target.value)}
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        />

        <IoCloseCircle
          onClick={() => setLotNumber('')}
          style={{
            top: 5,
            zIndex: 100,
            fontSize: 30,
            cursor: 'pointer',
            position: 'absolute',
            transition: 'all 0.3s ease',
            right: lotNumber.length > 0 ? 4 : 0,
            visibility: lotNumber.length > 0 ? 'visible' : 'hidden',
          }}
        />
      </Block>
    </>
  );
};

export default LotDoku;
