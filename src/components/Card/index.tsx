import { FC } from "react";
import { Block, Button, Text, Time } from "..";
import Target from "../Icons/Target";
import Info from "../Icons/Info";
import { useTranslation } from "../../hooks";
interface CardProps {
  title: string;
  subTitle: string;
  durationMinutes: number;
  infos: string;
  image?: string;
  onClick: () => void;
  openInfos?: () => void;
}

const Card: FC<CardProps> = ({
  title,
  subTitle,
  durationMinutes,
  image,
  onClick,
  openInfos,
}) => {
  const { t } = useTranslation();

  return (
    <Block width={"368px"} height={"483px"} card>
      <Block
        width={"368px"}
        height={207}
        radius={"8px 8px 0px 0px"}
        flexShrink={0}
        style={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "50%",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Block inlineFlex column align="flex-start" gap={12}>
        <Text cardTitle>
          {title.length > 17 ? title.substring(0, 17) + "..." : title}
        </Text>
        <Block flex column gap={12} marginLeft={24}>
          <Block flex align="center" gap={12}>
            <Target /> <Text p>{subTitle}</Text>
          </Block>
          <Block flex align="center" gap={12}>
            <Time /> <Text p>{durationMinutes + " Minuten"}</Text>
          </Block>
        </Block>
        <Block
          flex
          width={"368px"}
          justify="space-between"
          align="center"
          padding={24}
        >
          <Info style={{ cursor: "pointer" }} onClick={openInfos} />

          <Button onClick={onClick}>{t("common.toTest")}</Button>
        </Block>
      </Block>
    </Block>
  );
};

export default Card;
