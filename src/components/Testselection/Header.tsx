import { Block, Button, Text } from "..";
import { useNavigate } from "react-router-dom";
import { Barcode } from "../Icons";
import { useTranslation } from "../../hooks";
import DropDown from "./DropDown/DropDown";

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
        <DropDown />
      </Block>
    </Block>
  );
};

export default Header;
