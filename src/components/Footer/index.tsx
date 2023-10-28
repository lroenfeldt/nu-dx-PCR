import { useState, useEffect } from "react";
import { useData, useTranslation } from "../../hooks";
import { useNavigate } from "react-router-dom";
import Server from "../Icons/Server";
import Ellipse from "../Icons/Ellipse";
import { Block, Text } from "..";
import moment from "moment";
import "moment/dist/locale/de";
import "moment/dist/locale/fr";
import "moment/dist/locale/en-gb";

const Footer = () => {
  const { settings } = useData();
  const navigate = useNavigate();
  const { locale } = useTranslation();
  const [stateTime, setStateTime] = useState(
    moment().locale(locale).format("LL") +
      " " +
      moment().locale(locale).format("LTS")
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setStateTime(
        moment().locale(locale).format("LL") +
          " " +
          moment().locale(locale).format("LTS")
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [stateTime]);

  return (
    <Block
      flex
      secGrad
      justify="space-between"
      align="center"
      padding={"12px 24px"}
      height="56px"
      position="relative"
    >
      <Block
        flex
        gap={11}
        center
        align="center"
        onDoubleClick={() => navigate("/debug")}
      >
        <Text p white>
          {settings.account.data.name}
        </Text>
      </Block>
      <Block flex row align="center" justify="flex-end" gap={32}>
        <Text p white>
          {stateTime}
        </Text>
        <Server />
        <Ellipse />
      </Block>
    </Block>
  );
};

export default Footer;
