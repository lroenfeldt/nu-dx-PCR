import React, { useState } from 'react';
import Line from '../components/Charts/Line';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation, useData } from '../hooks';
import {
  TestStatus,
  Block,
  Button,
  ButtonArea,
  ChangeResults,
  AlteredResult,
  Checkmark,
  ResultsFooter,
} from '../components';
import { TbEdit, TbGripHorizontal } from 'react-icons/tb';
import { hexToRGB } from '../utils/helper';
function ViewCurves() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { barcodes, selectedMethod, settings, handleOpenEdit } = useData();

  const barcode = barcodes.find((barcode) => barcode.id === parseInt(id));
  const testmethod = settings.account.testprocedures.find((procedure) => procedure.id === selectedMethod);
  return (
    <div>
      <Block center>
        <div
          style={{
            width: '150vh',
            height: '45vh',
          }}
        >
          {barcode && <Line barcode={barcode} />}
        </div>
      </Block>

      <Block
        center
        gap={30}
        position="absolute"
        align="baseline"
        bottom={-127}
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <ButtonArea
          style={{
            position: 'relative',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            left: 'auto',
            transform: 'none',
          }}
        >
          <Button onClick={() => window.history.go(-1)}>{t('default.common.back')}</Button>
        </ButtonArea>
        <ResultsFooter
          activeBarcode={barcode}
          testmethod={testmethod}
          settings={settings}
          barcodes={barcodes}
          locale="en"
          navigate={navigate}
        />
      </Block>
    </div>
  );
}

export default ViewCurves;
