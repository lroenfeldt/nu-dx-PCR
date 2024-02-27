import { useEffect, useState } from "react";

import { useData, useDropdownValues } from "../../../hooks";
import { Block } from "../..";
import useDropDownStyle from "./useDropDownStyle";
import { Values } from "../../../types/interfaces/useData";

const DropDown = () => {
  const {
    isActive,
    setIsActive,
    selectedItem,
    setSelectedItem,
    setSelected,
    dropDownValue,
    setDropDownValue,
    selected,
  } = useData();
  const { valuesArr } = useDropdownValues();
  const { dropDown, option, child, selectedItemColor } = useDropDownStyle();

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

  // useEffect(() => {
  //   console.log(selected);
  // }, [selected]);

  return (
    <Block
      style={dropDown}
      className={`dropdown ${isActive ? "active" : ""}`}
      onClick={handleDropdownClick}
    >
      <Block
        onClick={() => {
          isActive ? setSelected(true) : null;
          isActive ? console.log("first") : null;
        }}
        style={selectedItemColor}
      >
        {selectedItem}
      </Block>
      <Block style={option}>
        {valuesArr
          .filter((value) => value.value !== dropDownValue)
          .map((value, index) => {
            return (
              <Block
                style={index >= 1 ? child : undefined}
                onClick={() => {
                  setSelected(false);
                  setDropDownValue(value.value as Values);
                  console.log("ahdjlk");
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
