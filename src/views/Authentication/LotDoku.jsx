import React from 'react';
import { Block, CustomSelect } from '../../components';
import { useData, useTranslation } from '../../hooks';
const LotDoku = () => {
  const { t } = useTranslation();
  const { settings, selectedMethod, lotNumber, setLotNumber } = useData();
  return (
    <>
      <h4>{t('authentication.currentLot')}</h4>
      <CustomSelect options={['Lot', 'Doku']} defaultValue="" onChange={(value) => console.log(value)} />
    </>
  );
};

export default LotDoku;
