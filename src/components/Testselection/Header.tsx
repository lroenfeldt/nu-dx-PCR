import { Block, Button, Text } from "..";
import { useNavigate } from "react-router-dom";
import { Barcode } from "../Icons";
import { useData, useTranslation } from "../../hooks";
import FiltereMenuHolder from "./FiltereMenu";
import { colors } from "../../assets/theme";

const Header = () => {
  const navigate = useNavigate();
  const { setFilterMenu, filterMenu, filterMenuOptions, page } = useData();
  const { t } = useTranslation();
  return (
    <Block
      padding={"0px 22px"}
      marginBottom={20}
      flex
      row
      spaceBetween
      width={"100%"}
    >
      {/* <FiltereMenuHolder /> */}

      <Block flex row gap={32}>
        <Text h1>{t("common.testSelection")}</Text>

        <Button onClick={() => navigate("/lot-kit")}>
          <Block flex row gap={10} center alignCenter>
            <Barcode />
            Scann
          </Block>
        </Button>
      </Block>

      {page !== "cards" ? (
        <Block flex row gap={10} alignCenter>
          <Text h4 style={{ fontWeight: 600 }}>
            {t("common.sortBy")}
          </Text>
          <Block
            height={"100%"}
            onClick={() => {
              !filterMenu ? setFilterMenu(true) : setFilterMenu(false);
            }}
            style={{
              color: colors.primary.main,
              width: "232px",
              borderRadius: "16px",
              fontFamily: "Inter",
              fontStyle: "normal",
              fontWeight: 600,
              backgroundColor: "#fff",
              cursor: "pointer",
              border: `4px solid ${colors.primary.main}`,
              fontSize: "24px",
              padding: "13px 30px",
            }}
          >
            {filterMenuOptions}
          </Block>
        </Block>
      ) : null}
    </Block>
  );
};

export default Header;
