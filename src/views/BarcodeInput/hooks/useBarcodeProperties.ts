import { useTranslation, useData } from "../../../hooks";
import { IBarcode } from "../../../types/interfaces/interfaces";

const useBarcodeProperties = () => {
	const { t } = useTranslation();
	const { barcodes } = useData();
	const checkBarcodeValidity = (barcode: IBarcode, settings: any) => {
		barcode= barcodes.find((currentBarcode) => currentBarcode.posName === barcode.posName) || barcode;
		console.log("barcode", barcode.value);
		let isValid = true;
		let validationErr = null;
            //check empty
            if (!(barcode.value.length >= 1)) {
                isValid = false;
            }
		if (barcode.value.startsWith("R") || barcode.value.includes("-R")) {
			return { isValid, validationErr };
		}

		for (const char of barcode.value) {
			if (!settings.account.allowedCharacters.includes(char)) {
				isValid = false;
				validationErr = t("errors.invalidcharacters") + settings.account.allowedCharacters;
			}
		}

		if (!(barcode.value.length >= settings.account.minBarcodeLength)) {
			isValid = false;
			validationErr = t("errors.minBarcodeLength", {
				minLength: settings.account.minBarcodeLength,
			});
		}
		if (barcode.value.length > settings.account.maxBarcodeLength) {
			isValid = false;
			validationErr = t("errors.maxBarcodeLength", {
				maxLength: settings.account.maxBarcodeLength,
			});
		}
		//Check duplicates
		barcodes.forEach((currentBarcode, index) => {
			if (barcode.value.length>0 && currentBarcode.value === barcode.value && currentBarcode.posName !== barcode.posName) {
				isValid = false;
				validationErr = t("errors.barcodeAlreadyUsed", {
					position: currentBarcode.posName,
				});
			}
		});
		return { isValid, validationErr };
	};
    
	const checkControlPlaceholders = (barcode: IBarcode) => {
		const controlPlaceholders = ["Placeholder_NTC", "Placeholder_TPC", "SC2NTC", "SC2TPC", "TPC", "NTC"];
		if (controlPlaceholders.includes(barcode.value)) {
			barcode = {
				...barcode,
				checking: false,
				valid: true,
				error: t("errors.controlSampleDetected"),
			};

			if (["SC2NTC", "Placeholder_NTC", "NTC"].includes(barcode.value)) {
				barcode.label = "NTC";
			}

			if (["SC2TPC", "Placeholder_TPC", "TPC"].includes(barcode.value)) {
				barcode.label = "TPC";
			}

			return barcode;
		}
		return null;
	};

	return { checkBarcodeValidity, checkControlPlaceholders };
};

export default useBarcodeProperties;
