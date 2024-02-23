import { useEffect, useState } from "react";
import "./drobdown.css";
import { useData, useDropdownValues } from "../../hooks";
3;

const DropDown = () => {
  const [isActive, setIsActive] = useState(false);
  const { valuesArr, renderedChildren } = useDropdownValues();

  const { dropDownValue, selectedItem, setSelectedItem } = useData();
  const [filteredChildren, setFilteredChildren] =
    useState<JSX.Element[]>(renderedChildren);

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
    <div
      className={`dropdown ${isActive ? "active" : ""}`}
      onClick={handleDropdownClick}
    >
      <div className="children">{selectedItem}</div>
      <div className="option">{filteredChildren}</div>
    </div>
  );
};

export default DropDown;
