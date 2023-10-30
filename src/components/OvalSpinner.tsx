import { Oval } from "react-loader-spinner";
import { Block } from ".";
import { useTheme } from "../hooks";
import { IOvalSPinner } from "../types/components";

function OvalSpinner(props: IOvalSPinner) {
  const { colors } = useTheme();
  return (
    <Block flex center style={{ fontSize: "90px" }}>
      <Oval
        height={props.height}
        width={props.width}
        color={colors.progressBar.running}
        secondaryColor={colors.progressBar.standby}
      />
    </Block>
  );
}

export default OvalSpinner;
