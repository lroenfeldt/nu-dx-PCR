import { CSSProperties } from 'react';
import colors from '../../assets/theme/base/colors';

import { useTheme } from '../../assets/theme';
const MainStyle = () => {
  const {colors, boxShadows} = useTheme();
  const MainTheme: { [key: string]: CSSProperties } = {
    button: {
      display: "flex",
      height: "64px",
      padding: "13px 30px",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap:" 10px",
      borderRadius: "44px",
      color: colors.white.main,
      fontFamily: "Inter",
      fontSize: "28px",
      fontStyle: "normal",
      fontWeight: 600,
      //lineHeight: "48px",
      backgroundColor: colors.primary.main,
      cursor: "pointer",
      boxShadow: boxShadows.buttonShadow.main,
    },
  };

  return MainTheme;
};
export default MainStyle;
