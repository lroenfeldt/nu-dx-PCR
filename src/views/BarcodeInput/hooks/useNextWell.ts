import { useState } from "react";
import { useData } from "../../../hooks";
import { IUseNextWell } from "../../../types/interfaces/views";

const useNextWell = ({ active, markActive, checkBarcode }: IUseNextWell) => {
  const [disabled, setDisabled] = useState(false);
  const { barcodes, settings } = useData();
  const nextWell = (next: boolean) => {
    let nextWell = active;
    const blockedBarcodes = barcodes
      .filter((barcode) => barcode.blocked === true)
      .map((blockedBarcode) => blockedBarcode.id);
    setDisabled(false);
    const wellCount = settings.device.wellCount;
    if (active <= wellCount && wellCount == 96) {
      for (let j = -13; j <= wellCount; j++) {
        if (next === true) {
          if (nextWell === 96 && blockedBarcodes.includes(1))
            return setDisabled(true);
          if (j === nextWell && blockedBarcodes.includes(nextWell + 12)) {
            if (nextWell + 24 === 97) return setDisabled(true);
            if (blockedBarcodes.includes(nextWell + 24))
              return markActive(nextWell + 36);
            return markActive(nextWell + 24);
          }
          if (
            j === nextWell &&
            j >= 85 &&
            blockedBarcodes.includes(nextWell - 83)
          )
            return markActive(nextWell - 83 + 12);
          if (j === nextWell && j === 96 && !blockedBarcodes.includes(1))
            return markActive(1);
          if (j === nextWell && j >= 85) return markActive(j - 83);
          if (j === nextWell && j < 85) return markActive(j + 12);
        } else {
          if (
            j === nextWell &&
            blockedBarcodes.includes(nextWell - 12) &&
            blockedBarcodes.includes(nextWell - 24)
          )
            return markActive(96);
          if (
            j === nextWell &&
            j > 12 &&
            j <= 24 &&
            nextWell - 12 === 1 &&
            blockedBarcodes.includes(nextWell - 12)
          )
            return markActive(96);
          if (j === nextWell && blockedBarcodes.includes(nextWell + 12))
            return markActive(nextWell + 24);
          if (
            j === nextWell &&
            j > 12 &&
            j <= 24 &&
            blockedBarcodes.includes(nextWell - 12)
          )
            return markActive(j - 12 + 83);
          if (j === nextWell && j <= 1) return markActive(96);
          if (j === nextWell && j <= 12) return markActive(j + 83);
          if (j === nextWell && j > 12) return markActive(j - 12);
        }
      }
    } else if (wellCount == 16) {
      if (next === true) {
        do nextWell++;
        while (barcodes.find((barcode) => barcode.id === nextWell)?.blocked);
        if (nextWell > wellCount) return;
        markActive(nextWell);
      } else {
        do nextWell--;
        while (barcodes.find((barcode) => barcode.id === nextWell)?.blocked);
        if (nextWell < 1) return;
        markActive(nextWell);
      }
    }
    if (active === wellCount) {
      checkBarcode(wellCount);
    }
  };

  return {
    nextWell,
    disabled,
  };
};

export default useNextWell;
