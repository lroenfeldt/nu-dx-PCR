import React, { FC } from "react";
import Keyboard from "../../../components/Keyboard";
import { IBarcode } from "../../../types/interfaces/interfaces";
import { useData } from "../../../hooks";

interface BarcodeKeyboardProps {
	active: number;
	nextWell: (next: boolean) => void;
	getBarcode: (active: number) => IBarcode;
	inputs: Record<string, string>;
	inputName: string;
	onKeyPress: (e: string) => void;
	setInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
	clear: boolean;
	setClear: React.Dispatch<React.SetStateAction<boolean>>;
	keyboardActive: boolean;
	setKeyboardActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const BarcodeKeyboard: FC<BarcodeKeyboardProps> = ({
	active,
	nextWell,
	getBarcode,
	inputs,
	inputName,
	onKeyPress,
	setInputs,
	clear,
	setClear,
	keyboardActive,
	setKeyboardActive,
}) => {
	const numberRegex = new RegExp("^[0-9]+$");
	const { settings } = useData();
	return (
		<Keyboard
			onPrev={() => nextWell(false)}
			onNext={() => nextWell(true)}
			barcode={getBarcode(active)}
			inputs={inputs}
			inputName={inputName}
			onChange={(e: string) => onKeyPress(e)}
			setInputs={setInputs}
			clear={clear}
			setClear={setClear}
			visible={keyboardActive}
			setVisible={setKeyboardActive}
			inputValue={getBarcode(active)?.value}
			isNumeric={numberRegex.test(settings.account.allowedCharacters)}
		/>
	);
};

export default BarcodeKeyboard;
