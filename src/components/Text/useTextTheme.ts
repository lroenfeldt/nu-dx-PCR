import { useTheme } from "../../assets/theme";

function useTextTheme() {
  const { typography } = useTheme();
  const textTheme = {
    h1: {
      ...typography.h1,
    },
    h2: {
      ...typography.h2,
    },
    h3: {
      ...typography.h3,
    },
    h4: {
      ...typography.h4,
    },
    h5: {
      ...typography.h5,
    },
    h6: {
      ...typography.h6,
    },

    body: {
      ...typography.body1,
    },

    caption: {
      ...typography.caption,
    },
    button: {
      ...typography.button,
    },
    overline: {
      ...typography.overline,
    },
    p: {
      ...typography.p,
    },
    small: {
      ...typography.small,
    },
    label: {
      ...typography.label,
    },
    cardTitle: {
      fontSize: "36px",
      fontStyle: "normal",
      fontWeight: 700,
      lineHeight: "48px",
      marginLeft: 24,
      marginTop: 16,
    },
  };

  return textTheme;
}

export default useTextTheme;
