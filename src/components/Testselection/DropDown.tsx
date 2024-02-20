import React, { useEffect, useState } from "react";
import "./drobdown.css";
import { useTranslation } from "../../hooks";
import { Arrow, Clock, Funnel, ProfileSmall } from "../Icons";

interface DropdownProps {
  children: JSX.Element;
  onChange?: (item: JSX.Element) => void;
}

type ChildProps = {
  children: JSX.Element;
  onClick?: () => void;
  className?: string;
};

const DropDown = ({ children, onChange }: DropdownProps) => {
  const { locale, t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<JSX.Element>(
    <>
      <Funnel />
      {t("common.testName")}
      <Arrow />
    </>
  );

  const languageMap: { [key: string]: string } = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
  };

  useEffect(() => {
    // setSelectedItem(languageMap[locale]);
  }, [locale]);

  const handleItemClick = (item: JSX.Element) => {
    // setSelectedItem(item);
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
        onClick: () => handleItemClick(child.props.children as JSX.Element),
        className: child.props.children === selectedItem ? "selected" : "",
      });
    }
    return child;
  });

  return (
    <div
      id="dropdown"
      className={`dropdown ${isActive ? "active" : ""}`}
      onClick={handleDropdownClick}
    >
      <div className="textBox">
        <div className="children">{selectedItem}</div>
      </div>
      <div className="option">{renderedChildren}</div>
    </div>
  );
};

export default DropDown;
