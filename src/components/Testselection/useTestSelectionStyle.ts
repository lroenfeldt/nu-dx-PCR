import { CSSProperties } from 'react';
import { useTheme } from '../../assets/theme';
const useTestSelectionStyle = () => {
  const { colors, boxShadows, borders } = useTheme();
  const TestSelectionTheme: { [key: string]: CSSProperties } = {
    testSelection: {
      position: 'relative',
      display: 'inline-flex',
      
      height: 'auto',
      scrollSnapType: 'x mandatory',
      width: '100%',
      gap: 54,

    },
    nextTest: {
      position: 'fixed',
      top: '50%',
      right: 8,
      transform: 'translateY(-50%)',
      transition: 'all 0.3s ease-in-out',
      border: '0px solid transparent',
      cursor: 'pointer',
    },
    prevTest: {
      position: 'fixed',
      top: '50%',
      left: 8,
      transform: 'translateY(-50%)',
      transition: 'all 0.3s ease-in-out',
      border: '0px solid transparent',
      cursor: 'pointer',
    },
  
    testInfo: {
      display: "flex",
      width: "742px",
      height: "704px",
      padding: "32px",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
      borderRadius: borders.borderRadius.main,
      background: colors.white.main,
      boxShadow: boxShadows.cardShadow.main,
      position: "relative",
    },
    testInfoBody: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "25px",
      alignSelf: "stretch",
    },
    testInfoContent: {
      display: "flex",
      alignItems: "flex-start",
      gap: "25px",
      alignSelf: "stretch",
    },
    testInfoContentLeft: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "16px",
      width: "374px",
    },
    testInfoContentRight: {
      display: "flex",
      alignItems:"flex-end",
      gap: "16px",
    },
    testInfoFooter: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "flex-end",
      alignSelf: "stretch",
    },
    testInfoTitle: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "8px",
    },
    testInfoDetails:{ 
      display: "flex",
      alignItems: "center",
      gap: "8px",
      alignSelf: "stretch",
      height: "32px",
    },
    testInfoDetailsLeft: {
      display: "flex",
      width: "166px",
      alignItems: "center",
      gap: "8px",
    },
    testInfoQrcodeScan: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: "14px",
    },
    testInfoIFU: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    closeBtn: {
      position: "absolute",
      top: -20,
      right: -20,
      cursor: "pointer",
    },
    testInfoSubtitle: {
      color: "#646D89",
      fontFamily: "Inter",
      fontSize: "28px",
      fontStyle: "normal",
      fontWeight: 500,
      lineHeight: "32px"
    }
  };

  return TestSelectionTheme;
};

export default useTestSelectionStyle;
