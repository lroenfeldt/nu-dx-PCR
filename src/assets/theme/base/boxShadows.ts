import colors from "./colors";

import boxShadow from "../functions/boxShadow";
const { black} = colors;

const boxShadows = {

	buttonShadow: {
		main: boxShadow([0, 8], [28, 0], black.main, 0.15),
	},
	cardShadow: {
		main: boxShadow([0, 8], [28, 0], black.main, 0.15),
	},
	dropShadowLarge: {
		main: boxShadow([0, 8], [28, 0], black.main, 0.15),
	},
};

export default boxShadows;
