import Block from '../Block';
import Button from '../Button';
import Checkmark from '../Checkmark';
import AlteredResult from '../AlteredResult';
import ChangeResults from '../ChangeResults';
import { VscGraphLine } from 'react-icons/vsc';
import { useLocation } from 'react-router-dom';
import { IResultsFooter } from '../../types/interfaces/interfaces';
import { Result } from '../../types/interfaces/settings';

const ResultsFooter = ({ activeBarcode, testmethod, barcodes, locale = 'en', navigate }: IResultsFooter) => {
  const location = useLocation();
  return (
    <div className={`resultContainer`}>
      <Block
        row={0}
        top={0}
        left={0}
        color={''}
        white={true}
        width={170}
        align={'center'}
        center={true}
        radius={5}
        height={0}
        margin={0}
        bottom={0}
        border={''}
        padding={0}
        children={<h4>{activeBarcode.value} </h4>}
        overflow={''}
        position={''}
        marginTop={0}
        marginLeft={0}
        paddingTop={0}
        marginRight={0}
        paddingLeft={0}
        borderColor={''}
        marginBottom={0}
        paddingRight={0}
        paddingBottom={0}
        marginVertical={0}
        paddingVertical={0}
        marginHorizontal={0}
        paddingHorizontal={0}
        column={0}
        zIndex={0}
      />
      {testmethod.showResults && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            bottom: 'auto',
            left: 'auto',
            right: 'auto',
            overflow: 'visible',
          }}
        >
          <Button
            align={'center'}
            children={
              <>
                {barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result == 'invalid'
                  ? 'invalid'
                  : testmethod.results?.find(
                      (result: Result) =>
                        result.name.includes(barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result) ||
                        result.name == barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result
                    )?.['label' + locale?.toUpperCase()] ||
                    barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result}

                <AlteredResult
                  activeBarcode={barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]}
                  testmethod={testmethod}
                  style={undefined}
                />
                <Checkmark
                  barcode={barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]}
                  style={{
                    right: 0,
                    fontSize: 20,
                    maxWidth: 50,
                  }}
                  isNinetySix={false}
                />
              </>
            }
          />

          <ChangeResults activeBarcode={activeBarcode} testmethod={testmethod} isTable={false} />
        </div>
      )}
      <Block
        row={0}
        top={0}
        left={0}
        color={''}
        white={false}
        width={0}
        align={''}
        center={false}
        radius={0}
        height={0}
        margin={0}
        bottom={0}
        border={''}
        padding={0}
        justify={'space-between'}
        overflow={''}
        position={''}
        marginTop={0}
        marginLeft={0}
        paddingTop={0}
        marginRight={0}
        paddingLeft={0}
        borderColor={''}
        marginBottom={0}
        paddingRight={0}
        paddingBottom={0}
        marginVertical={0}
        paddingVertical={0}
        marginHorizontal={0}
        paddingHorizontal={0}
        column={0}
        gap="20px"
        zIndex={0}
        children={
          <>
            {testmethod.parameters?.map((parameter: { isPrimary: boolean; showCT: boolean; target: string }) => {
              if (parameter.isPrimary && parameter.showCT) {
                return (
                  <div key={parameter.target.toString()} className="resultBadge ct">
                    CT:{' '}
                    {activeBarcode.parameters?.[parameter.target]
                      ? activeBarcode.parameters?.[parameter.target]?.ct
                      : activeBarcode.parameters?.[parameter.target.toLowerCase()]?.ct}
                  </div>
                );
              }
            })}

            {testmethod.showCurves && !location.pathname.includes('viewCurves') && (
              <Button className={'btn-viewCurve'} onClick={() => navigate(`/viewCurves/${activeBarcode.id}`)}>
                <VscGraphLine size={45} />
              </Button>
            )}
          </>
        }
      />
    </div>
  );
};

export default ResultsFooter;
