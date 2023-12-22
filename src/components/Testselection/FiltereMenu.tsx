import { Block, Modal } from "..";
import { colors } from "../../assets/theme";
import { useData, useTranslation } from "../../hooks";
import { Arrow, Clock, Funnel } from "../Icons";
import ProfileSmall from "../Icons/ProfileSmall";

const style: React.CSSProperties = {
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",
  backdropFilter: "blur(0px)",
  WebkitBackdropFilter: "blur(0px)",
  alignItems: "flex-start",
  left: 502,
};

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

const FiltereMenu = () => {
  const { t } = useTranslation();
  const {
    setFilterMenu,
    filterMenu,
    setFilterMenuOptions,
    runTime,
    testName,
    producer,
  } = useData();

  return (
    <Modal
      style={style}
      isVisible={filterMenu}
      setIsVisible={() => setFilterMenu(false)}
    >
      <Block>
        <Block
          flex
          row
          spaceBetween
          alignCenter
          height={"100%"}
          style={first}
          onClick={() => setFilterMenuOptions(testName)}
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
          onClick={() => setFilterMenuOptions(runTime)}
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
          onClick={() => setFilterMenuOptions(producer)}
        >
          <ProfileSmall />
          {t("common.producer")}
          <Arrow />
        </Block>
      </Block>
    </Modal>
  );
};
export default FiltereMenu;
