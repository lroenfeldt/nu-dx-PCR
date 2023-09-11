import React, { FC } from "react";
import InputComponent from "./InputComponent";
import { IBarcode } from "../../../types/interfaces/interfaces";
import { Block, Next, Prev, ActivateKeyboard } from "../../../components";

interface InputSectionProps {
	active: number;
	updateBarcode: (e: React.ChangeEvent<HTMLInputElement>) => void;
	nextWell: (next: boolean) => void;
	disabled: boolean;
	keyboardActive: boolean;
	setKeyboardActive: (active: boolean) => void;
	getBarcode: (active: number) => IBarcode;
}

const InputSection: FC<InputSectionProps> = ({ active, updateBarcode, nextWell, getBarcode, disabled, keyboardActive, setKeyboardActive }) => {
	return (
		<Block inlineFlex gap={53} align="center">
			<ActivateKeyboard onClick={() => setKeyboardActive(!keyboardActive)} />
			<Block flex gap={32} center align="center">
				<Prev onClick={() => nextWell(false)} disabled={disabled} />
				<InputComponent active={active} updateBarcode={updateBarcode} getBarcode={getBarcode} />
				<Next onClick={() => nextWell(true)} disabled={disabled} />
			</Block>
		</Block>
	);
};

export default InputSection;
