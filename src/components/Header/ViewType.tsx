import { Block, Proben, List } from "..";
import { colors } from "../../assets/theme";
import ViewTypeOption from "./ViewTypeOption";
import { useData } from "../../hooks";

const ViewType = () => {
  const { viewType, setViewType } = useData();
  return (
    <Block flex align="flex-start">
      <ViewTypeOption
        icon={
          <Proben
            color={
              viewType === "sample" ? colors.secondary.main : colors.white.main
            }
          />
        }
        labelKey="common.samples"
        isActive={viewType === "sample"}
        onClick={() => setViewType("sample")}
      />
      <ViewTypeOption
        icon={
          <List
            color={
              viewType === "list" ? colors.secondary.main : colors.white.main
            }
          />
        }
        labelKey="common.list"
        isActive={viewType === "list"}
        onClick={() => setViewType("list")}
      />
    </Block>
  );
};

export default ViewType;
