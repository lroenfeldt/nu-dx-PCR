import { Block, Text } from ".";

const ViewResultMsg = (props: {
  text: string;
  icon: JSX.Element;
  bgColor: string | undefined;
  iconBgColor: string | undefined;
}) => {
  return (
    <Block
      paddingLeft={10}
      paddingRight={10}
      height="32px"
      bgColor={props.bgColor}
      style={{ borderBottomLeftRadius: "8px" }}
      flex
      row
      center
      alignCenter
      gap={8}
    >
      <Block>
        <Text
          white
          style={{
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {props.text}
        </Text>
      </Block>
      <Block
        bgColor={props.iconBgColor}
        width="20px"
        height="20px"
        radius={25}
        flex
        center
        alignCenter
      >
        {props.icon}
      </Block>
    </Block>
  );
};

export default ViewResultMsg;
