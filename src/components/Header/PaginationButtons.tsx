import { useData } from "../../hooks";
import { Block, List, Text } from "..";
import { colors } from "../../assets/theme";

const PaginationButtons = () => {
  const { page, setPage } = useData();
  return (
    <>
      <Block flex row>
        <Block
          width={162}
          height={64}
          bgColor={
            page === "cards"
              ? colors.background.default
              : colors.secondary.focus
          }
          flex
          row
          center
          alignCenter
          gap={10}
          onClick={() => setPage("cards")}
          style={{
            cursor: "pointer",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }}
        >
          <List fill={page === "cards" ? colors.secondary.focus : "#FFF"} />
          <Text
            p
            style={{ fontSize: "28px", fontWeight: 600 }}
            color={page === "cards" ? colors.secondary.focus : "#FFF"}
          >
            Karten
          </Text>
        </Block>
        <Block
          width={162}
          height={64}
          bgColor={
            page === "table"
              ? colors.background.default
              : colors.secondary.focus
          }
          flex
          row
          center
          alignCenter
          gap={10}
          onClick={() => setPage("table")}
          style={{
            cursor: "pointer",
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }}
        >
          <List fill={page === "table" ? colors.secondary.focus : "#FFF"} />
          <Text
            p
            style={{ fontSize: "28px", fontWeight: 600 }}
            color={page === "table" ? colors.secondary.focus : "#FFF"}
          >
            Liste
          </Text>
        </Block>
      </Block>
    </>
  );
};

export default PaginationButtons;
