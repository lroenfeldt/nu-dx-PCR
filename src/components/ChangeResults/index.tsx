import Button from '../Button';
import { useData } from '../../hooks';
import { TbEdit } from 'react-icons/tb';

interface ActiveBarcode {
  id: string | number;
  alteredResult: boolean;
  result: string;
}

interface TestMethod {
  showResults: any;
  results: { name: string; color: string }[];
}

interface ChangeResultsProps {
  activeBarcode: ActiveBarcode;
  testmethod: TestMethod;
  isTable: boolean;
}
const ChangeResults = ({ activeBarcode, testmethod, isTable = false }: ChangeResultsProps) => {
  const { settings, barcodes, handleOpenEdit }: any = useData();
  if (!testmethod.showResults) return null;
  if (!activeBarcode || !settings.account.changeResults) return null;
  if (settings.account.changeResults && !isTable) {
    return (
      <Button
        className={undefined}
        onClick={() => handleOpenEdit(activeBarcode)}
        navigation={undefined}
        style={{
          borderRadius: '0 30px 30px 0',
          borderColor: 'transparent',
          backgroundColor:
            barcodes.filter((barcode: { id: string }) => barcode.id == activeBarcode.id)[0]?.result == 'invalid'
              ? 'orange'
              : testmethod.results.find((result) =>
                  result.name.includes(
                    barcodes.filter((barcode: { id: string }) => barcode.id == activeBarcode.id)[0]?.result
                  )
                )?.color,
          color: '#fff',
          display: 'grid',
          maxWidth: 75,
        }}
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
        <TbEdit size={20} />
      </Button>
    );
  }
  return (
    <div className="edit-result-btn" onClick={() => handleOpenEdit(activeBarcode)}>
      <TbEdit color="#fff" size={20} />
    </div>
  );
};

export default ChangeResults;
