import {
  ArrowOutlined,
  Clock,
  Funnel,
  ProfileSmall,
} from "../components/Icons";
import { useData, useTranslation } from ".";
import { IValuesArr } from "../types/interfaces/interfaces";
import { Block } from "../components";

const useDropdownValues = () => {
  const { t } = useTranslation();
  const values = ["testName", "runTime", "producer"];
  const { selectedItem, setDropDownValue } = useData();

  const rotateIcons = () => {
    console.log("first");

    const icon = document.querySelector(".arrow-icon");
    if (icon instanceof HTMLElement) {
      icon.style.transform = "rotate(180deg)";
    }
  };
  const name = (
    <>
      <Funnel />
      {t("common.testName")}
      <ArrowOutlined className="arrow-icon" onClick={() => rotateIcons()} />
    </>
  );
  const runtime = (
    <>
      <Clock />
      {t("common.runTime")}
      <ArrowOutlined className="arrow-icon" />
    </>
  );
  const producer = (
    <>
      <ProfileSmall />
      {t("common.producer")}
      <ArrowOutlined className="arrow-icon" />
    </>
  );

  const valuesArr: IValuesArr[] = [
    { id: 1, comp: name, value: "testName" },
    { id: 2, comp: runtime, value: "runTime" },
    { id: 3, comp: producer, value: "producer" },
  ];

  // function rotate the arrow icons

  const renderedChildren = valuesArr
    .filter((value) => value.comp !== selectedItem)
    .map((value) => {
      return (
        <Block
          onClick={() => {
            setDropDownValue(value.value);
          }}
          key={value.id}
        >
          {value.comp}
        </Block>
      );
    });

  return { name, runtime, producer, values, valuesArr, renderedChildren };
};

export default useDropdownValues;
