import axios, { CancelTokenSource } from 'axios';
import urls from "../../../config/settings";
import { useData, useTranslation } from "../../../hooks";
import { IBarcode } from "../../../types/interfaces/interfaces";

const useDatabaseCheck = () => {

  const { settings,  setLoading } = useData();
  const checkBarcodeUrl = settings.account.customCheckBarcodesEndpoint || urls.checkBarcodeUrl;
  
  const { t } = useTranslation();
  
  const checkAgainstDb = async (barcode: IBarcode, settings: any, cancelToken: any) => {
		let isValid = true;
		let validationErr = null;
		let askRetest = false;

		try {
			const response = await axios.get(`${checkBarcodeUrl}/${barcode.value}`, {
				cancelToken: cancelToken.token,
			});
			const result = response.data;

			if (result === null) {
				isValid = false;
				validationErr = t("errors.barcodeNotFound");
			} else if (result.status <= 3) {
				isValid = false;
				askRetest = settings.account.allowRetest && settings.account.verifyBarcodes;
				validationErr = t("errors.barcodeAlreadyInUse");
			} else if (settings.account.checkOrder && result.orderKey !== settings.account.orderKey) {
				isValid = false;
				validationErr = t("errors.barcodeNotInOrder");
			}

			setLoading(false);
		} catch (err:any) {
			if (axios.isCancel(err)) {
				console.log("Request canceled", err.message);
			} else {
				console.log("Error", err.message);
				window.api.logEvents(`Error: ${err.message}`, "LogErrors.txt");
				isValid = false;
				validationErr = t("errors.dbConnectionError");
			}
		}

		return { isValid, validationErr, askRetest };
	};
	const useCancelToken = () => {
		let cancelToken: CancelTokenSource | undefined;

		const create = () => {
			cancelToken = axios.CancelToken.source();
			return cancelToken;
		};

		const cancel = (message: string) => {
			if (cancelToken) {
				cancelToken.cancel(message);
			}
		};

		return { create, cancel };
	};
  return { checkAgainstDb, useCancelToken };
};

export default useDatabaseCheck;
