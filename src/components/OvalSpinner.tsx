import { Oval } from "react-loader-spinner";
import { Block } from ".";
import { useTheme } from "../hooks";
import { IOvalSPinner } from "../types/components";

function OvalSpinner(props: IOvalSPinner) {
  const { colors } = useTheme();
  return (
    <Block flex center>
      <Oval
        height={props.size}
        width={props.size}
        color={colors.progressBar.running}
        secondaryColor={colors.progressBar.standby}
      />
    </Block>
  );
}

export default OvalSpinner;
