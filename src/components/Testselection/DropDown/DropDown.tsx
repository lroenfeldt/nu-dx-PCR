import { useEffect, useState } from "react";

import { useData, useDropdownValues } from "../../../hooks";
import { Block } from "../..";
import useDropDownStyle from "./useDropDownStyle";

const DropDown = () => {
  const [selectedItem, setSelectedItem] = useState<JSX.Element>();
  const [dropDownValue, setDropDownValue] = useState("");
  const { isActive, setIsActive } = useData();
  const { valuesArr } = useDropdownValues();
  const { dropDown, option, child } = useDropDownStyle();

  useEffect(() => {
    if (dropDownValue === "testName") {
      setSelectedItem(valuesArr[0].comp);
    }
    if (dropDownValue === "runTime") {
      setSelectedItem(valuesArr[1].comp);
    }
    if (dropDownValue === "producer") {
      setSelectedItem(valuesArr[2].comp);
    }
  }, [dropDownValue]);

  const handleDropdownClick = () => {
    setIsActive(!isActive);
  };

  return (
    <Block
      style={dropDown}
      className={`dropdown ${isActive ? "active" : ""}`}
      onClick={handleDropdownClick}
    >
      <Block>{selectedItem}</Block>
      <Block style={option}>
        {valuesArr
          .filter((value) => value.value !== dropDownValue)
          .map((value, index) => {
            return (
              <Block
                style={index >= 1 ? child : undefined}
                onClick={() => {
                  setDropDownValue(value.value);
                }}
                key={value.id}
              >
                {value.comp}
              </Block>
            );
          })}
      </Block>
    </Block>
  );
};

export default DropDown;
