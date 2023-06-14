import React from 'react';
import Button from '../Button';
import { useData } from '../../hooks';
import { TbEdit, TbGripHorizontal } from 'react-icons/tb';
const ChangeResults = ({ activeBarcode, testmethod, isTable = false }) => {
  const { settings, isNinetySix, barcodes, handleOpenEdit } = useData();
  if (!testmethod.showResults) return null;
  if (!activeBarcode || !settings.account.changeResults) return null;
  if (settings.account.changeResults && !isTable) {
    return (
      <Button
        onClick={() => handleOpenEdit(activeBarcode)}
        style={{
          borderRadius: '0 30px 30px 0',
          borderColor: 'transparent',
          backgroundColor:
            barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result == 'invalid'
              ? 'orange'
              : testmethod.results.find((result) =>
                  result.name.includes(barcodes.filter((barcode) => barcode.id == activeBarcode.id)[0]?.result)
                )?.color,
          color: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}
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
