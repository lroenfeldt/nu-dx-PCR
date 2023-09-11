import { Input } from "../../../components";
import { FC, useRef } from "react";
import { IBarcode } from "../../../types/interfaces/interfaces";
import { useTranslation } from "../../../hooks";
interface InputComponentProps {
	active: number;
	updateBarcode: (e: React.ChangeEvent<HTMLInputElement>) => void;
	getBarcode: (active: number) => IBarcode;
}

const InputComponent: FC<InputComponentProps> = ({ active, updateBarcode, getBarcode }) => {
	const textInput = useRef(null);
	const { t } = useTranslation();
	return (
		<Input
			rounded
			autoFocus
			type="text"
			ref={textInput}
			onChange={updateBarcode}
			id={getBarcode(active).label}
			value={getBarcode(active).value}
			placeholder={t("barcodeInput.barcode")}
		/>
	);
};

export default InputComponent;
