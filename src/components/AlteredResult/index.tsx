import { useData } from '../../hooks';
import { hexToRGB } from '../../utils/helper';
import { SlPencil } from 'react-icons/sl';

interface ActiveBarcode {
  alteredResult: boolean;
  result: string; // or a specific union type if it can have specific values
}

interface TestMethod {
  results: { name: string; color: string }[];
  // Other properties and their types
}

interface AlteredResultProps {
  activeBarcode: ActiveBarcode | null;
  testmethod: TestMethod;
  style: any; // CSS.Properties
}

interface SettingsProps {
  account: { ChangeResults?: boolean };
}

const AlteredResult = ({ activeBarcode, testmethod, style }: AlteredResultProps) => {
  const { settings }: any = useData();

  if (activeBarcode?.alteredResult)
    return (
      <div
        className="alteredResult"
        style={{
          top: settings.account.ChangeResults ? 0 : 15,
          backgroundColor:
            activeBarcode?.result == 'invalid'
              ? 'orange'
              : hexToRGB(testmethod.results.find((result) => result.name.includes(activeBarcode?.result))?.color, 0.9),
          ...style,
        }}
      >
        <SlPencil color="#fff" size={10} />
      </div>
    );
  return null;
};

export default AlteredResult;
