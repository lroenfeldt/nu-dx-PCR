import { IoClose, IoCheckmarkSharp } from 'react-icons/io5';
import { ICheckmark } from '../types/interfaces/interfaces';

const Checkmark = ({ barcode, style }: ICheckmark) => {
  if (barcode?.label === 'NTC' && barcode?.result == 'negative') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--green)',
          ...style,
        }}
      >
        <IoCheckmarkSharp
          style={{
            fontSize: 'smaller',
          }}
        />
      </div>
    );
  }

  if (barcode?.label === 'NTC' && barcode?.result != 'negative') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--red)',
          ...style,
        }}
      >
        <IoClose />
      </div>
    );
  }

  if (barcode?.label === 'TPC' && barcode?.result === 'positive') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--green)',
          ...style,
        }}
      >
        <IoCheckmarkSharp
          style={{
            fontSize: 'smaller',
          }}
        />
      </div>
    );
  }

  if (barcode?.label === 'TPC' && barcode?.result != 'positive') {
    return (
      <div
        className={`checkmark`}
        style={{
          backgroundColor: 'var(--red)',
          ...style,
        }}
      >
        <IoClose />
      </div>
    );
  }
  return null;
};

export default Checkmark;
