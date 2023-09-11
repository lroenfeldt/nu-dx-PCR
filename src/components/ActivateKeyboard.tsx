import { IActivateKeyboard } from "../types/interfaces/interfaces";
import { Button } from ".";
import Keyboard from "./Icons/Keyboard";

const ActivateKeyboard = ({ onClick }: IActivateKeyboard) => {
	return (
		<Button secondary onClick={onClick} width={174} height={64}>
			<Keyboard />
		</Button>
	);
};

export default ActivateKeyboard;
