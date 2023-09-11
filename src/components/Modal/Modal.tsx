import React, { useEffect, FC } from "react";
import useModalStyle from "./useModalStyle";

interface ModalProps {
	children: React.ReactNode;
	isVisible: boolean;
	setIsvisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const Modal: FC<ModalProps> = ({ children, isVisible, setIsvisible }) => {
	const styles = useModalStyle();
	useEffect(() => {
		var modal = document.getElementById("modal");

		window.onclick = function (event) {
			if (modal && event.target == modal) {
				setIsvisible(false);
			}
		};
	}, [isVisible, setIsvisible]);

	return (
		<div id="modal" style={{ ...styles.modal, display: isVisible ? "flex" : "none" }}>
			{children}
		</div>
	);
};

export default Modal;
