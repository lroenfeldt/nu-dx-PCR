import { CSSProperties } from 'react';

const inputTheme: { [key: string]: CSSProperties } = {
  input: {
    display: 'flex',
    width: '289px',
    height: '64px',
    padding: '13px 30px',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '10px',
    borderRadius: '8px',
    border: `${1}px solid #E0E0E0`,
    background: '#FFF',
    boxShadow: '0px 8px 28px 0px rgba(0, 0, 0, 0.15)'
  }
};

export default inputTheme;
