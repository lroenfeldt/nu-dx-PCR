import React, { useState, useEffect, ReactNode } from "react";
import "./dropdown.css";
import { useTranslation } from "../../hooks";

interface DropdownProps {
	children: ReactNode;
	onChange?: (item: string) => void;
}
type ChildProps = {
	children: string;
	onClick?: () => void;
	className?: string;
};

const Dropdown: React.FC<DropdownProps> = ({ children, onChange }) => {
	const { locale } = useTranslation();
	const [isActive, setIsActive] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<string>("");

	const languageMap: { [key: string]: string } = {
		en: "English",
		fr: "Français",
		de: "Deutsch",
	};

	useEffect(() => {
		setSelectedItem(languageMap[locale]);
	}, [locale]);

	const handleItemClick = (item: string) => {
		setSelectedItem(item);
		setIsActive(!isActive);

		if (onChange) {
			onChange(item);
		}
	};

	const handleDropdownClick = () => {
		setIsActive(!isActive);
	};

	const renderedChildren = React.Children.map(children, (child) => {
		if (React.isValidElement<ChildProps>(child)) {
			return React.cloneElement(child, {
				onClick: () => handleItemClick(child.props.children as string),
				className: child.props.children === selectedItem ? "selected" : "",
			});
		}
		return child;
	});

	return (
		<div id="dropdown" className={`dropdown ${isActive ? "active" : ""}`} onClick={handleDropdownClick}>
			<div className="textBox">{selectedItem}</div>
			<div className="option">{renderedChildren}</div>
		</div>
	);
};

export default Dropdown;
