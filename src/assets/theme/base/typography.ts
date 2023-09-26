
import colors from "./colors";
import pxToRem from "../functions/pxToRem";

const { text } = colors;

const baseProperties = {
    fontFamily: 'inter', 
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    fontSizeXXS: pxToRem(10.4),
    fontSizeXS: pxToRem(12),
    fontSizeSM: "20px",
    fontSizeMD: pxToRem(24), 
    fontSizeLG: "24px", 
    fontSizeXL: "28px",
};

const baseHeadingProperties = {
    fontFamily: baseProperties.fontFamily,
    color: text.main, 
    fontWeight: baseProperties.fontWeightBold,
    fontStyle: "normal",
};

const baseDisplayProperties = {
    fontFamily: baseProperties.fontFamily,
    color: text.main, 
    fontWeight: baseProperties.fontWeightLight,
    lineHeight: 1.2,
};

const typography = {
    fontFamily: baseProperties.fontFamily,
    fontWeightLight: baseProperties.fontWeightLight,
    fontWeightRegular: baseProperties.fontWeightRegular,
    fontWeightMedium: baseProperties.fontWeightMedium,
    fontWeightBold: baseProperties.fontWeightBold,

    h1: {
        ...baseHeadingProperties,
        fontSize: "44px",
        lineHeight: "56px",
    },

    h2: {
        fontSize: "36px",
        lineHeight: "48px",
        ...baseHeadingProperties,
    },

    h3: {
        ...baseHeadingProperties,
        fontSize: "32px",
        lineHeight: "44px",
        fontWeight: baseProperties.fontWeightBold,
    },

    h4: {
        fontSize: "24px",
        lineHeight: "32px",
        ...baseHeadingProperties,
    },

    h5: {
        fontSize: "20px",
        lineHeight: "28px",
        ...baseHeadingProperties,
    },

    h6: {
        fontSize: pxToRem(16),
        lineHeight: 1.625,
        ...baseHeadingProperties,
    },
    p: {
        ...baseHeadingProperties,
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeMD,
        fontWeight: baseProperties.fontWeightMedium,
        lineHeight: "32px",
        color: text.default, 
    },
    small: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeSM,
        fontWeight: baseProperties.fontWeightRegular,
        lineHeight: "28px",
        color: '--content-cnt-text-body', 
    },
    label : {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXL,
        fontWeight: baseProperties.fontWeightSemiBold,
        lineHeight: "32px",
        color: text.main, 
    },
	subtitle1: {
		fontFamily: baseProperties.fontFamily,
		fontSize: baseProperties.fontSizeXL,
		fontWeight: baseProperties.fontWeightRegular,
		lineHeight: 1.625,
	},

	subtitle2: {
		fontFamily: baseProperties.fontFamily,
		fontSize: baseProperties.fontSizeMD,
		fontWeight: baseProperties.fontWeightMedium,
		lineHeight: 1.6,
	},

	body1: {
		fontFamily: baseProperties.fontFamily,
		fontSize: baseProperties.fontSizeXL,
		fontWeight: baseProperties.fontWeightRegular,
		lineHeight: 1.625,
	},

	body2: {
		fontFamily: baseProperties.fontFamily,
		fontSize: baseProperties.fontSizeMD,
		fontWeight: baseProperties.fontWeightRegular,
		lineHeight: 1.6,
	},

	button: {
		fontFamily: baseProperties.fontFamily,
		fontSize: baseProperties.fontSizeSM,
		fontWeight: baseProperties.fontWeightBold,
		lineHeight: 1.5,
		textTransform: "uppercase",
	},

	caption: {
		fontFamily: baseProperties.fontFamily,
		fontSize: baseProperties.fontSizeXS,
		fontWeight: baseProperties.fontWeightRegular,
		lineHeight: 1.25,
	},

	overline: {
		fontFamily: baseProperties.fontFamily,
	},

	d1: {
		fontSize: pxToRem(80),
		...baseDisplayProperties,
	},

	d2: {
		fontSize: pxToRem(72),
		...baseDisplayProperties,
	},

	d3: {
		fontSize: pxToRem(64),
		...baseDisplayProperties,
	},

	d4: {
		fontSize: pxToRem(56),
		...baseDisplayProperties,
	},

	d5: {
		fontSize: pxToRem(48),
		...baseDisplayProperties,
	},

	d6: {
		fontSize: pxToRem(40),
		...baseDisplayProperties,
	},

	size: {
		xxs: baseProperties.fontSizeXXS,
		xs: baseProperties.fontSizeXS,
		sm: baseProperties.fontSizeSM,
		md: baseProperties.fontSizeMD,
		lg: baseProperties.fontSizeLG,
		xl: baseProperties.fontSizeXL,
	},

lineHeight: {
    sm: 28, 
    md: 32, 
    lg: 44, 
},

};

export default typography;
