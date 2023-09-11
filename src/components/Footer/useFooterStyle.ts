import { CSSProperties } from 'react';
import { useTheme } from '../../assets/theme';
import nudx from  '../../assets/Logos/nu-diagnostics/nudx.png';
const useFooterStyle = () => {
  const { colors } = useTheme();
  const footerTheme: { [key: string]: CSSProperties } = {
    footerLogo: {
      display: 'flex',
      justifyContent: 'center',
      width: '174.894px',
      height: '24px',
      backgroundImage: `url(${nudx})`,
      //backgroundColor: 'lightgray',
      backgroundPosition: '50%',  
      backgroundSize: 'cover', 
      backgroundRepeat: 'no-repeat',
      position: "absolute",
      right: "552.106px",
      top: "16px"
      
    }
  };

  return footerTheme;
};

export default useFooterStyle;
