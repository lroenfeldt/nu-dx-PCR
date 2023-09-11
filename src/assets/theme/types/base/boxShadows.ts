export interface IButtonBoxShadow {
  main: string;
  stateOf: string;
  stateOfNotHover: string;
}

export interface IInputBoxShadow {
  focus: string;
  error: string;
  success: string;
}

export interface ISliderBoxShadow {
  thumb: string;
}

export interface IBoxShadows {
  buttonShadow: {
    main: string;
  };
  cardShadow: {
    main: string;
  };
  dropShadowLarge: {
    main: string;
  };
}