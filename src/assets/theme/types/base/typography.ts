export interface IFontProperties {
  fontFamily: string;
  fontWeight: number | string;
  lineHeight?: number | string;
  fontSize?: number | string;
  textTransform?: string;
  color?: string;
}

export interface IBaseProperties {
  fontFamily: string;
  fontWeightLight: number;
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightBold: number;
  fontSizeXXS: string;
  fontSizeXS: string;
  fontSizeSM: string;
  fontSizeMD: string;
  fontSizeLG: string;
  fontSizeXL: string;
}
interface IOverlineProperties {
  fontFamily: string;
  
}



export interface ITypography {
  fontFamily: string;
  fontWeightLight: number;
  fontWeightRegular: number;
  fontWeightMedium: number;
  fontWeightBold: number;

  h1: IFontProperties;
  h2: IFontProperties;
  h3: IFontProperties;
  h4: IFontProperties;
  h5: IFontProperties;
  h6: IFontProperties;
  p: IFontProperties;

  small: IFontProperties;
  label: IFontProperties;
  
  subtitle1: IFontProperties;
  subtitle2: IFontProperties;
  
  body1: IFontProperties;
  body2: IFontProperties;
  
  button: IFontProperties;
  
  caption: IFontProperties;
  
  overline: IOverlineProperties;

  d1: IFontProperties;
  d2: IFontProperties;
  d3: IFontProperties;
  d4: IFontProperties;
  d5: IFontProperties;
  d6: IFontProperties;

  size: {
    xxs: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  lineHeight: {
    sm: number;
    md: number;
    lg: number;
  };
}
