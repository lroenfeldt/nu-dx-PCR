import colors from '../base/colors';
import globals from '../base/globals';
import typography from '../base/typography';
import breakpoints from '../base/breakpoints';
import boxShadows from '../base/boxShadows';
import borders from '../base/borders';
const darkTheme = {
  colors:{
    ...colors,
    primary: {
      main: '#10caf8',
    }
  },
  globals,
  typography,
  breakpoints,
  boxShadows,
  borders,
};

export default darkTheme;
