import React from "react";
import useProbeStyle from "./useProbeStyle";
import { Block, Text } from "..";
import { useTheme } from "../../assets/theme";
import Invalid from "./Invalid";
import { IBarcode } from "../../types/interfaces/interfaces";
import { useData } from "../../hooks";
import { TailSpin } from "react-loader-spinner";
import Negative from "./Negative";
import Positive from "./Positive";
interface ProbeProps {
  onClick?: () => void;
  isActive: boolean;
  result?: string;
  showResults?: boolean;
  testmethod?: string;
  barcode: IBarcode;
}
const Probe: React.FC<ProbeProps> = ({
  barcode,
  isActive,
  onClick,
  showResults = false,
}) => {
  const styles = useProbeStyle();
  const { colors } = useTheme();
  const { settings } = useData();
  if (showResults) {
    return (
      <Block
        onClick={!(barcode.result == "") ? onClick : null}
        style={{
          ...styles.default,
          ...(isActive ? styles.active : {}),
          backgroundColor: ["negative", "positive", "invalid"].includes(
            barcode.result
          )
            ? colors.test[barcode.result as "negative" | "positive" | "invalid"]
            : styles.default.backgroundColor,
          cursor: barcode.result == "" ? "not-allowed" : "pointer",
        }}
      >
        <Text
          white
          fontSize="32px"
          fontStyle="normal"
          fontWeight={700}
          lineHeight="normal"
          color={
            !(barcode.result == "") ? colors.secondary.main : colors.white.main
          }
        >
          {barcode?.label}
        </Text>
        {barcode.result == "negative" && <Negative />}
        {barcode.result == "positive" && <Positive />}
        {barcode.result == "invalid" && <Invalid cycle />}
      </Block>
    );
  }
  return (
    <Block
      onClick={!barcode.blocked ? onClick : null}
      style={{
        ...styles.default,
        ...(isActive ? styles.active : {}),
        ...(barcode?.valid && { backgroundColor: colors.probe.valid }),
        ...((barcode.value === "TPC" || barcode.value === "NTC") &&
          settings.account.autoControl && {
            backgroundColor: colors.grey[600],
            cursor: "not-allowed",
          }),
        ...(!barcode.checking &&
          barcode.value.length >= 1 &&
          !barcode.valid && { backgroundColor: colors.probe.invalid }),
      }}
    >
      <Text
        white
        fontSize="32px"
        fontStyle="normal"
        fontWeight={700}
        lineHeight="normal"
        color={
          !barcode.blocked && barcode.value.length >= 1
            ? colors.secondary.main
            : colors.white.main
        }
      >
        {barcode?.label}
      </Text>
      {!barcode.checking && barcode.value.length >= 1 && !barcode.valid && (
        <Invalid />
      )}
      {barcode.checking && (
        <Block flex align="center" justify="center" position="absolute" top={0}>
          <TailSpin color={colors.white.main} height={100} width={100} />
        </Block>
      )}
    </Block>
  );
};

export default Probe;
