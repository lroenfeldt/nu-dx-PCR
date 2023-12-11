import { Back, Block, Text } from "..";
import { t } from "i18n-js";

const BackButton = () => {
  return (
    <>
      <Block
        align="center"
        flex
        gap={11}
        center
        onClick={() => window.history.back()}
        style={{ cursor: "pointer" }}
      >
        <Back />
        <Text
          p
          white
          fontSize="28px"
          fontStyle="normal"
          fontWeight={600}
          lineHeight="48px"
          style={{ cursor: "pointer" }}
        >
          {t("common.back")}
        </Text>
      </Block>
    </>
  );
};

export default BackButton;
