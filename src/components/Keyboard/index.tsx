import "./style.css";
import { IoCloseCircle } from "react-icons/io5";
import SimpleKeyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { useEffect, useState, useRef, memo } from "react";
import { IKeyboardRef } from "../../types/interfaces/interfaces";
import { IKeyboard } from "../../types/components";

function Keyboard(props: IKeyboard) {
	const [layoutName, setLayoutName] = useState("default");
	const { dark, style, clear, inputs, visible, onChange, setClear, setInputs, inputName, setVisible, isNumeric = false } = props;

	const keyboard = useRef<IKeyboardRef | null>(null);

	const onClear = () => {
		keyboard.current?.clearInput();
	};
	const onChangeAll = (newInput: any) => {
		setInputs((prevInputs: any) => ({ ...prevInputs, ...newInput }));
		console.log("Inputs changed", inputs);
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
		if (button === "{downkeyboard}") {
			setVisible(false);
		}
		if (button === "{default}") {
			setLayoutName(layoutName === "default" ? "shift" : "default");
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
			<IoCloseCircle onClick={() => setVisible(false)} className="close-icon" />
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
		</div>
	);
}

export default memo(Keyboard);
