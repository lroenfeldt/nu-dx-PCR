import { CSSProperties } from "react";
import { useTheme } from "../../assets/theme";
const useProbeStyle = () => {
  const { borders, colors } = useTheme();

  const ProbeTheme: { [key: string]: CSSProperties } = {
    default: {
      display: "flex",
      width: "108px",
      height: "108px",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px",
      borderRadius: borders.borderRadius.probe,
      backgroundColor: colors.probe.main,
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      position: "relative",
    },
    active: {
      border: `${borders.borderWidth.probe}px solid ${colors.primary.main}`,
      transform: "scale(1.1)",
    },
    valid: {
      background: colors.probe.valid,
    },
  };

  return ProbeTheme;
};

export default useProbeStyle;
