import Line from '../components/Charts/Line';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation, useData } from '../hooks';
import { Block, Button, ButtonArea, ResultsFooter } from '../components';

function ViewCurves() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { barcodes, selectedMethod, settings } = useData();

  const barcode = barcodes.find((barcode) => barcode.id === parseInt(id as string));
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
          {barcode && <Line barcode={barcode} result={''} />}
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
        children={
          <>
            <ButtonArea
              children={<Button onClick={() => window.history.go(-1)} children={t('common.back')} />}
              noborder={false}
              style={{ left: 'auto', right: 'auto', bottom: 'auto', transform: 'none', position: 'relative' }}
            />
            <ResultsFooter
              locale="en"
              settings={settings}
              barcodes={barcodes}
              navigate={navigate}
              testmethod={testmethod}
              activeBarcode={barcode}
            />
          </>
        }
      />
    </div>
  );
}

export default ViewCurves;
