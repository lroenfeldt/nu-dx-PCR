import { t } from "i18n-js";
import { Block, Button, Text } from "..";
import { useNavigate } from "react-router-dom";
import { Barcode, Filter } from "../Icons";
import { useData } from "../../hooks";
import FiltereMenuHolder from "./FiltereMenu";

const Header = () => {
  const navigate = useNavigate();
  const { setFilterMenu, filterMenu } = useData();
  return (
    <Block
      padding={"0px 22px"}
      marginBottom={20}
      flex
      row
      spaceBetween
      alignCenter
      width={"100%"}
    >
      <FiltereMenuHolder />

      <Block flex row gap={32}>
        <Text h1>{t("common.testSelection")}</Text>

        <Button onClick={() => navigate("/lot-kit")}>
          <Block flex row gap={10} center alignCenter>
            <Barcode />
            Scann
          </Block>
        </Button>
      </Block>

      <Button
        onClick={() =>
          !filterMenu ? setFilterMenu(true) : setFilterMenu(false)
        }
        radius={16}
        outlined
      >
        <Block flex row gap={10} center alignCenter>
          <Filter />
          Sortieren nach
        </Block>
      </Button>
    </Block>
  );
};

export default Header;
