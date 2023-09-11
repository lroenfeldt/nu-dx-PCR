import { CSSProperties } from 'react';
import colors from '../../assets/theme/base/colors';
import boxShadows from '../../assets/theme/base/boxShadows';
const buttonTheme: { [key: string]: CSSProperties } = {
  button: {
    display: 'flex',
    height: '64px',
    padding: '13px 30px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '50px', 
    boxShadow: boxShadows.buttonShadow.main,
    cursor: 'pointer',
    fontSize: '28px',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '48px',
    border: '0px solid transparent',
    backgroundColor: colors.primary.main, 
    color: colors.white.main,
    width: '187px',
    transition: 'all 0.3s ease-in-out',
  },
};

export default buttonTheme;
