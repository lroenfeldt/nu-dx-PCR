export interface IColorSet {
  main?: string;
  focus?: string;
  default?: string;
  secondary?: string;
  alert?: string;
  warning?: string;
  error?: string;
  success?: string;
  info?: string;
  light?: string;
  dark?: string;
  disabled?: string;
  hover?: string;
  active?: string;
  transparency?: string;
}

export interface IGradientSet {
  main: string;
  state?: string;
}

export interface IInputColors {
  borderColor: IColorSet;
  boxShadow: string;
  error: string;
  success: string;
}

export interface IColors {
  background: IColorSet;
  text: IColorSet;
  transparent: IColorSet;
  white: IColorSet;
  black: IColorSet;
  primary: IColorSet;
  secondary: IColorSet;
  test: {
    main: string;
    positive: string;
    negative: string;
    invalid: string;
  };
  probe: {
    main: string;
    invalid: string;
    valid: string;
  };
  info: IColorSet;
  success: IColorSet;
  warning: IColorSet;
  error: IColorSet;
  grey: {
    [key: number]: string;
  };
  progressBar: {
    standby: string;
    running: string;
  };
  gradients: {
    primary: IGradientSet;
    secondary: IGradientSet;
    info: IGradientSet;
    success: IGradientSet;
    warning: IGradientSet;
    error: IGradientSet;
    light: IGradientSet;
    dark: IGradientSet;
  };
  inputColors: IInputColors;
}
