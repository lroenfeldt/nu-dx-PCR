import SimpleKeyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./style.css";
import { useEffect, useState, useRef, memo } from "react";
import { IBarcode, IKeyboardRef } from "../../types/interfaces/interfaces";
import { IKeyboard } from "../../types/components";
import Close from "../Close";
import { Block } from "..";
import Prev from "../Icons/Prev";
import Probe from "../Probe";
import Next from "../Icons/Next";
import Input from "../Input";
import { useTranslation } from "../../hooks";

function Keyboard(props: IKeyboard) {
	const [layoutName, setLayoutName] = useState("default");
	const { dark, style, clear, inputs, visible, onChange, setClear, setInputs, inputName, setVisible, isNumeric = false, barcode, onPrev, onNext } = props;
	const { t } = useTranslation();
	const keyboard = useRef<IKeyboardRef | null>(null);

	const onClear = () => {
		keyboard.current?.clearInput();
	};
	const onChangeAll = (newInput: object) => {
		setInputs((prevInputs) => ({ ...prevInputs, ...newInput }));
	};

	const onKeyPress = (button: string) => {
		if (button === "{shift}" || button === "{lock}") {
			setLayoutName(layoutName === "default" ? "shift" : "default");
		}
		if (button === "{alt}" || button === "{altright}") {
			setLayoutName(layoutName === "default" ? "alt" : "default");
		}
		if (button === "{enter}") {
			setVisible(false);
		}
	};

	const layout = {
		default: [
			"{tab} q w e r t y u i o p {bksp}",
			"{undo} a s d f g h j k l {enter}",
			"{alt} z x c v b n m , . {alt}",
			"{default} {none} {space} {default} {downkeyboard}",
		],
		shift: [
			"{tab} Q W E R T Y U I O P {bksp}",
			"{undo} A S D F G H J K L {enter}",
			"{alt} X C V B N M , . {alt}",
			"{default} {none} {space} {default} {downkeyboard}",
		],
		numeric: ["1 2 3 4 5 6 7 8 9", "{bksp} 0 {enter}"],
		alt: [
			"{tab} 1 2 3 4 5 6 7 8 9 0 {bksp}",
			`{undo} @ # $ & * ( ) ' " {enter}`,
			"{shift} % - + = / ; : ! ? {shift}",
			"{default} {none} {space} {default} {downkeyboard}",
		],
	};

	useEffect(() => {
		keyboard.current?.setInput(inputs[inputName]);
	}, [inputs, inputName, visible]);

	useEffect(() => {
		if (clear) {
			onClear();
			setClear(false);
		}
	}, [clear]);

	useEffect(() => {
		const keyboard = document.getElementById("keyboard");

		if (visible) {
			window.onclick = function (event) {
				if (event.target == keyboard) {
					setVisible(false);
				}
			};
		}

		setLayoutName(isNumeric ? "numeric" : "default");
	}, [visible, isNumeric]);
	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const { value } = e.target as HTMLInputElement;
		if (onChange) onChange(value as string);
	};

	if (!visible) return null;
	return (
		<div
			id="keyboard"
			className={`${visible ? "visible" : ""} `}
			style={{
				top: 0,
				left: 0,
				...style,
			}}>
			<Block flex align="center" column gap={30} position="relative" style={{ cursor: "auto" }}>
				<Block position="absolute" top={-35} right={140} cursor>
					<Close onClick={() => setVisible(false)} />
				</Block>
				<Block inlineFlex center align="center" gap={48} card transparency padding={"0px 32px"} height={157}>
					<Prev onClick={onPrev} />
					<Probe barcode={barcode as IBarcode} isActive={true} />
					<Next onClick={onNext} />
					<Input rounded placeholder={t("common.barcode")} value={barcode?.value} onChange={handleKeyPress} />
				</Block>

				<SimpleKeyboard
					keyboardRef={(r) => (keyboard.current = r)}
					inputName={inputName}
					onChangeAll={onChangeAll}
					onChange={onChange}
					onKeyPress={onKeyPress}
					layoutName={layoutName}
					layout={layout}
					theme={`hg-theme-default ${dark ? "dark" : "light"} animate hg-theme-ios`}
					display={{
						//"{alt}": ".?123",
						"{shift}": "⇧",
						"{shiftactivated}": "⇧",
						"{enter}": "return",
						"{bksp}": "delete",
						"{altright}": ".?123",
						"{downkeyboard}": "🞃",
						"{space}": " ",
						"{default}": "ABC",
						"{back}": "⇦",
						"{tab}": "tab",
						"{undo}": "undo",
						"{alt}": "#+=",
						"{ABC}": "ABC",
					}}
				/>
			</Block>
		</div>
	);
}

export default memo(Keyboard);
