import { ArrowOutlined, Clock, Funnel, ProfileSmall } from "../../Icons";
import { useData, useTranslation } from "../../../hooks";
import { IValuesArr } from "../../../types/interfaces/interfaces";
import { Block } from "../..";
import useDropDownStyle from "./useDropDownStyle";
import { IOptions } from "../../../types/components";
import { useEffect } from "react";

const Options = ({ leftIcon, value, arrowIcon, style }: IOptions) => {
  const { valuesStyle } = useDropDownStyle();
  return (
    <Block
      flex
      row
      spaceBetween
      alignCenter
      width="100%"
      height="100%"
      style={valuesStyle}
    >
      <Block flex row center gap={10} alignCenter>
        {leftIcon}
        {value}
      </Block>
      <Block style={style} flex row center alignCenter>
        {arrowIcon}
      </Block>
    </Block>
  );
};

const useDropdownValues = () => {
  const { t } = useTranslation();
  const values = ["testName", "runTime", "producer"];
  const { selected, dropDownValue } = useData();

  const testName = (
    <Options
      leftIcon={<Funnel />}
      value={t("common.testName")}
      arrowIcon={<ArrowOutlined />}
      style={{
        transform:
          selected && dropDownValue === "testName" ? "rotate(180deg)" : "",
      }}
    />
  );

  const runtime = (
    <Options
      leftIcon={<Clock />}
      value={t("common.runTime")}
      arrowIcon={<ArrowOutlined />}
      style={{
        transform:
          selected && dropDownValue === "runTime" ? "rotate(180deg)" : "",
      }}
    />
  );

  const producer = (
    <Options
      leftIcon={<ProfileSmall />}
      value={t("common.producer")}
      arrowIcon={<ArrowOutlined />}
      style={{
        transform:
          selected && dropDownValue === "producer" ? "rotate(180deg)" : "",
      }}
    />
  );

  const valuesArr: IValuesArr[] = [
    { id: 1, comp: testName, value: "testName" },
    { id: 2, comp: runtime, value: "runTime" },
    { id: 3, comp: producer, value: "producer" },
  ];

  return {
    testName,
    runtime,
    producer,
    values,
    valuesArr,
  };
};

export default useDropdownValues;
