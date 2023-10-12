import { CSSProperties } from "react";

const useRackVisualRowsStyle = () => {
  const RackVisualRowsTheme: { [key: string]: CSSProperties } = {
    default: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "16px",
    },
    rackRow: {
      display: "flex",
      alignItems: "flex-start",
      gap: "16px",
    },
  };

  return RackVisualRowsTheme;
};

export default useRackVisualRowsStyle;
