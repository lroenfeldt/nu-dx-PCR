import Block from '../Block';
import Button from '../Button';
import Checkmark from '../Checkmark';
import AlteredResult from '../AlteredResult';
import ChangeResults from '../ChangeResults';
import { VscGraphLine } from 'react-icons/vsc';
import { useLocation } from 'react-router-dom';

interface ActiveBarcode {
  parameters: any;
  value: number;
  id: string | number;
  result: string;
  name: string;
  alteredResult: boolean;
}

interface ResultsFooterProps {
  activeBarcode: ActiveBarcode;
  testmethod: any;
  settings: any;
  barcodes: ActiveBarcode[];
  locale: string;
  navigate: any;
}

const ResultsFooter = ({ activeBarcode, testmethod, barcodes, locale = 'en', navigate }: ResultsFooterProps) => {
  const location = useLocation();
  return (
    <div className={`resultContainer`}>
      <Block
        row={0}
        top={0}
        end={undefined}
        gray={undefined}
        info={undefined}
        wrap={undefined}
        blur={undefined}
        tint={undefined}
        left={0}
        style={undefined}
        color={''}
        black={undefined}
        white={true}
        width={170}
        align={'center'}
        right={undefined}
        start={undefined}
        shadow={undefined}
        center={true}
        scroll={undefined}
        danger={undefined}
        radius={5}
        height={0}
        margin={0}
        bottom={0}
        border={''}
        primary={undefined}
        warning={undefined}
        success={undefined}
        padding={0}
        justify={undefined}
        children={<h4>{activeBarcode.value} </h4>}
        outlined={undefined}
        overflow={''}
        tertiary={undefined}
        position={''}
        secondary={undefined}
        marginTop={0}
        intensity={undefined}
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
        transition={undefined}
        gap={undefined}
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
            className={undefined}
            onClick={undefined}
            navigation={undefined}
            style={undefined}
            card={undefined}
            center={undefined}
            outlined={undefined}
            overflow={undefined}
            row={undefined}
            safe={undefined}
            keyboard={undefined}
            scroll={undefined}
            color={undefined}
            gradient={undefined}
            primary={undefined}
            secondary={undefined}
            tertiary={undefined}
            black={undefined}
            white={undefined}
            gray={undefined}
            danger={undefined}
            warning={undefined}
            success={undefined}
            info={undefined}
            radius={undefined}
            height={undefined}
            width={undefined}
            margin={undefined}
            marginBottom={undefined}
            marginTop={undefined}
            marginHorizontal={undefined}
            marginVertical={undefined}
            marginRight={undefined}
            marginLeft={undefined}
            padding={undefined}
            paddingBottom={undefined}
            paddingTop={undefined}
            paddingHorizontal={undefined}
            paddingVertical={undefined}
            paddingRight={undefined}
            paddingLeft={undefined}
            justify={undefined}
            align={'center'}
            wrap={undefined}
            blur={undefined}
            intensity={undefined}
            tint={undefined}
            position={undefined}
            disable={undefined}
            right={undefined}
            left={undefined}
            top={undefined}
            bottom={undefined}
            end={undefined}
            start={undefined}
            neumorphism={undefined}
            children={
              <>
                {barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result == 'invalid'
                  ? 'invalid'
                  : testmethod.results.find(
                      (result: ActiveBarcode) =>
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
        end={undefined}
        gray={undefined}
        info={undefined}
        wrap={undefined}
        blur={undefined}
        tint={undefined}
        left={0}
        style={undefined}
        color={''}
        black={undefined}
        white={false}
        width={0}
        align={''}
        right={undefined}
        start={undefined}
        shadow={undefined}
        center={false}
        scroll={undefined}
        danger={undefined}
        radius={0}
        height={0}
        margin={0}
        bottom={0}
        border={''}
        primary={undefined}
        warning={undefined}
        success={undefined}
        padding={0}
        justify={'space-between'}
        outlined={undefined}
        overflow={''}
        tertiary={undefined}
        position={''}
        secondary={undefined}
        marginTop={0}
        intensity={undefined}
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
        transition={undefined}
        gap="20px"
        zIndex={0}
        children={
          <>
            {testmethod.parameters.map((parameter: { isPrimary: boolean; showCT: boolean; target: string }) => {
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
              <Button
                className={'btn-viewCurve'}
                onClick={() => navigate(`/viewCurves/${activeBarcode.id}`)}
                navigation={undefined}
                style={undefined}
                card={undefined}
                center={undefined}
                outlined={undefined}
                overflow={undefined}
                row={undefined}
                safe={undefined}
                keyboard={undefined}
                scroll={undefined}
                color={undefined}
                gradient={undefined}
                primary={undefined}
                secondary={undefined}
                tertiary={undefined}
                black={undefined}
                white={undefined}
                gray={undefined}
                danger={undefined}
                warning={undefined}
                success={undefined}
                info={undefined}
                radius={undefined}
                height={undefined}
                width={undefined}
                margin={undefined}
                marginBottom={undefined}
                marginTop={undefined}
                marginHorizontal={undefined}
                marginVertical={undefined}
                marginRight={undefined}
                marginLeft={undefined}
                padding={undefined}
                paddingBottom={undefined}
                paddingTop={undefined}
                paddingHorizontal={undefined}
                paddingVertical={undefined}
                paddingRight={undefined}
                paddingLeft={undefined}
                justify={undefined}
                align={undefined}
                wrap={undefined}
                blur={undefined}
                intensity={undefined}
                tint={undefined}
                position={undefined}
                disable={undefined}
                right={undefined}
                left={undefined}
                top={undefined}
                bottom={undefined}
                end={undefined}
                start={undefined}
                neumorphism={undefined}
              >
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
