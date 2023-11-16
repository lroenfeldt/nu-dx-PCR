import { IBarcode } from "../types/interfaces/interfaces";
import { ISettings } from "../types/interfaces/settings";

/**
 * Generate default barcodes depending on the device type
 * @param {object} settings - the device settings
 * @returns {Array} - an array of barcodes
 * */
export default function useDefaultBarcodes(settings: ISettings): IBarcode[] {
  //Plate Setup
  let defaultBarcodes = [];
  const rowLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
  ];
  const length = settings?.device?.wellCount == 96 ? 12 : 8;
  const wellCount = settings?.device?.wellCount;

  for (let i = 1; i <= wellCount; i++) {
    let rowIndex = Math.ceil(i / length) - 1;
    let blocked = false;

    //Set Position Name
    let posName =
      i - rowIndex * length < 10
        ? rowLetters[rowIndex] + "0" + (i - rowIndex * length).toString()
        : rowLetters[rowIndex] + "" + (i - rowIndex * length).toString();
    let label = posName;
    let value = "";
    let valid = false;

    defaultBarcodes.push({
      id: i,
      posName,
      label,
      value,
      checking: false,
      valid,
      error: "",
      blocked,
      result: "",
      barcode: "",
      name: "",
      askRetest: null,
    });
  }

  return defaultBarcodes as IBarcode[];
}
