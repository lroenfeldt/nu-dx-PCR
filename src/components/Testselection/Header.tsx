import { Block, Button, Modal, Text } from "..";
import { useNavigate } from "react-router-dom";
import { Arrow, Barcode, Clock, Funnel, ProfileSmall } from "../Icons";
import { useData, useTranslation } from "../../hooks";
import DropDown from "./DropDown";
import "./drobdown.css";

const Header = () => {
  const navigate = useNavigate();
  // const { setFilterMenu, filterMenu, filterMenuOptions, page } = useData();
  const { t } = useTranslation();

  const name = (
    <>
      <Funnel />
      {t("common.testName")}
      <Arrow />
    </>
  );
  const runtime = (
    <>
      <Clock />
      {t("common.runTime")}
      <Arrow />
    </>
  );
  const producer = (
    <>
      <ProfileSmall />
      {t("common.producer")}
      <Arrow />
    </>
  );

  return (
    <Block
      padding={"0px 22px"}
      marginBottom={20}
      flex
      row
      alignCenter
      spaceBetween
      width={"100%"}
    >
      <Block flex row gap={32}>
        <Text h1>{t("common.testSelection")}</Text>

        <Button onClick={() => navigate("/lot-kit")}>
          <Block flex row gap={10} center alignCenter>
            <Barcode />
            Scann
          </Block>
        </Button>
      </Block>

      <Block flex row gap={10} alignCenter>
        <Text h4 style={{ fontWeight: 600 }}>
          {t("common.sortBy")}
        </Text>
        <DropDown
          children={
            <>
              <Block>{name}</Block>
              <Block>{runtime}</Block>
              <Block>{producer}</Block>
            </>
          }
        />
      </Block>
    </Block>
  );
};

export default Header;
