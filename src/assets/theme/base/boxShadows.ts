import colors from "./colors";

import boxShadow from "../functions/boxShadow";
const { black, secondary} = colors;


const boxShadows = {
    buttonShadow: {
        main: boxShadow([0, 8], [28, 0], black.main, 0.15),
    },
    cardShadow: {
        main: boxShadow([0, 8], [28, 0], black.main, 0.15),
    },
    dropShadowLarge: {
        main: boxShadow([0, 8], [28, 0], secondary.focus, 0.15), 
    },
    dropShadowSmall: {
        main: boxShadow([0, 4], [14, 0], secondary.focus, 0.25), 
    },
    innerShadow: {
        main: boxShadow([999, 999], [0, 0], black.main, 0.08, "inset"), 
    }
};


export default boxShadows;
