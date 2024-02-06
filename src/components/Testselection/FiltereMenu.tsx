import { useEffect, useState } from "react";
import { Block } from "..";
import { colors } from "../../assets/theme";
import { useData, useTranslation } from "../../hooks";
import { Arrow, Clock, Funnel } from "../Icons";
import ProfileSmall from "../Icons/ProfileSmall";

const blockStyle: React.CSSProperties = {
  color: colors.primary.main,
  width: "232px",
  padding: "13px 30px",
  borderRadius: "16px",
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: 600,
  backgroundColor: "#fff",
  cursor: "pointer",
  border: `4px solid ${colors.primary.main}`,
  fontSize: "24px",
};

const firstBlock: React.CSSProperties = {
  borderBottomRightRadius: "0px",
  borderBottomLeftRadius: "0px",
  borderBottom: `2px solid ${colors.primary.main}`,
};
const secondBlock: React.CSSProperties = {
  borderTopRightRadius: "0px",
  borderTopLeftRadius: "0px",
  borderBottomRightRadius: "0px",
  borderBottomLeftRadius: "0px",
  borderTop: `2px solid ${colors.primary.main}`,
  borderBottom: `2px solid ${colors.primary.main}`,
};
const thirdBlock: React.CSSProperties = {
  borderTopRightRadius: "0px",
  borderTopLeftRadius: "0px",
  borderTop: `2px solid ${colors.primary.main}`,
};

const first = { ...blockStyle, ...firstBlock };
const second = { ...blockStyle, ...secondBlock };
const third = { ...blockStyle, ...thirdBlock };

const FiltereMenu = ({ onClose }: { onClose: () => void }) => {
  const [defaultState, setDefaultState] = useState(null);

  const { t } = useTranslation();
  const {
    setFilterMenu,
    setFilterMenuOptions,
    runTime,
    testName,
    producer,
    filterMenuOptions,
  } = useData();

  useEffect(() => {
    if (defaultState == null) {
      setFilterMenuOptions(testName);
    }
  }, [defaultState]);

  return (
    <Block paddingLeft={1004} paddingBottom={18}>
      <Block
        flex
        row
        spaceBetween
        alignCenter
        height={"100%"}
        style={first}
        onClick={() => {
          setFilterMenuOptions(testName);
          setFilterMenu(false);
          console.log(filterMenuOptions.props);
        }}
      >
        <Funnel />
        {t("common.testName")}
        <Arrow />
      </Block>

      <Block
        flex
        row
        spaceBetween
        alignCenter
        height={"100%"}
        style={second}
        onClick={() => {
          setFilterMenuOptions(runTime);
          setFilterMenu(false);
        }}
      >
        <Clock />
        {t("common.runTime")}
        <Arrow />
      </Block>

      <Block
        flex
        row
        spaceBetween
        alignCenter
        height={"100%"}
        style={third}
        onClick={() => {
          setFilterMenuOptions(producer);
          setFilterMenu(false);
        }}
      >
        <ProfileSmall />
        {t("common.producer")}
        <Arrow />
      </Block>
    </Block>
  );
};
export default FiltereMenu;
