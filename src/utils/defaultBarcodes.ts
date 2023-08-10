import { IBarcode } from '../types/interfaces/interfaces';
import { Settings } from '../types/interfaces/settings';

/**
 * Generate default barcodes depending on the device type
 * @param {object} settings - the device settings
 * @returns {Array} - an array of barcodes
 * */
export default function useDefaultBarcodes(settings: Settings): IBarcode[] {
  //Plate Setup
  let defaultBarcodes = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  let demoSet = false;
  const wellCount = settings?.device?.wellCount;
  const length = wellCount == 96 ? 12 : 8;

  for (let i = 1; i <= wellCount; i++) {
    let rowIndex = Math.ceil(i / length) - 1;
    let blocked = false;

    //Set Position Name
    let posName =
      i - rowIndex * length < 10
        ? rowLetters[rowIndex] + '0' + (i - rowIndex * length)
        : rowLetters[rowIndex] + '' + (i - rowIndex * length);
    let label = posName;
    let value = '';
    let valid = false;
    //Set Controls
    if (posName === settings.user.tpcPos && settings.account.autoControl) {
      blocked = settings.account.autoControl;
      label = 'TPC';
      value = 'TPC';
      valid = true;
    }
    if (posName === settings.user.ntcPos && settings.account.autoControl) {
      blocked = settings.account.autoControl;
      label = 'NTC';
      value = 'NTC';
      valid = true;
    }
    //Set Demo Code for Development
    if (
      settings.isDev &&
      settings.account.autoControl &&
      posName !== settings.user.ntcPos &&
      posName !== settings.user.tpcPos &&
      !demoSet
    ) {
      value = '3575910784';
      valid = true;
      demoSet = true;
    }

    defaultBarcodes.push({
      id: i,
      posName,
      label,
      value,
      checking: false,
      valid,
      error: null,
      blocked,
    });
  }

  return defaultBarcodes as IBarcode[];
}
