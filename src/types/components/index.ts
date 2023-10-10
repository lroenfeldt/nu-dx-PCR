import { ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";
import { IAccountUser, ITestProcedure } from "../interfaces/settings";
import { IBarcode } from "../interfaces/interfaces";

export interface TBlockProps {
  row?: boolean;
  top?: any;
  end?: boolean;
  grey?: boolean;
  info?: boolean;
  wrap?: boolean;
  blur?: number;
  tint?: boolean;
  left?: any;
  style?: CSSProperties;
  color?: string;
  black?: boolean;
  white?: boolean;
  width?: string | number;
  align?: string;
  right?: any;
  start?: boolean;
  shadow?: boolean;
  card?: boolean;
  center?: boolean;
  scroll?: boolean;
  error?: boolean;
  radius?: string | number;
  height?: string | number;
  margin?: string | number;
  bottom?: any;
  border?: string;
  primary?: boolean;
  warning?: boolean;
  success?: boolean;
  padding?: string | number;
  justify?: string;
  children?: ReactNode;
  outlined?: boolean;
  overflow?: string;
  flex?: boolean;
  position?: string;
  secondary?: boolean;
  marginTop?: string | number;
  intensity?: number;
  marginLeft?: string | number;
  paddingTop?: string | number;
  marginRight?: string | number;
  paddingLeft?: string | number;
  borderColor?: string;
  marginBottom?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  marginVertical?: string | number;
  paddingVertical?: string | number;
  marginHorizontal?: string | number;
  paddingHorizontal?: string | number;
  borderTop?: string | number;
  borderLeft?: string | number;
  borderRight?: string | number;
  borderBottom?: string | number;
  column?: boolean;
  transition?: string;
  gap?: string | number;
  zIndex?: number;
  bgColor?: string;
  inlineFlex?: boolean;
  flexShrink?: number;
  cursor?: boolean;
  opacity?: number;
  transform?: string;
  scrollX?: boolean;
  scrollY?: boolean;
  alignSelf?: string;
  transparency?: Boolean;
  secGrad?: Boolean;
  priGrad?: Boolean;
  [key: string]: any;
}

export type InputsType = { [key: string]: string };

export interface ILotDokuProps {
  inputs?: InputsType;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  inputName: string;
  setInputName: React.Dispatch<React.SetStateAction<string>>;
  keyboardVisible: boolean;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isChargenNrFocused: boolean;
  setIsChargenNrFocused: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IInputContainerProps {
  signal: boolean;
  isUser: boolean;
  isValid: boolean;
  password: string;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  currentUser?: IAccountUser;
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (event: React.KeyboardEvent) => void;
  keyboardVisible: boolean;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsChargenNrFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isChargenNrFocused: boolean;
  inputName: string;
  setInputName: React.Dispatch<React.SetStateAction<string>>;
  getInputValue: (name: string) => string;
  setInputs: React.Dispatch<React.SetStateAction<InputsType>>;
  inputs?: InputsType;
}

export interface IKeyboard {
  dark?: boolean;
  style?: React.CSSProperties;
  clear: boolean;
  visible: boolean;
  inputs: InputsType;
  onChange?:
    | ((input: string) => string)
    | undefined
    | ((value: string) => void);
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  setInputs: React.Dispatch<React.SetStateAction<InputsType>>;
  inputName: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isNumeric?: boolean;
  inputValue?: string | boolean | null;
  barcode?: IBarcode;
  onPrev?: () => void;
  onNext?: () => void;
}

export interface IHideErrorProps {
  type?: string;
  index?: number;
  remember?: boolean;
}

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id?: string;
  navigation?: boolean;
  shadow?: boolean;
  card?: boolean;
  center?: boolean;
  outlined?: boolean;
  overflow?: boolean;
  row?: boolean;
  safe?: boolean;
  keyboard?: boolean;
  scroll?: boolean;
  color?: string;
  gradient?: boolean;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  black?: boolean;
  white?: boolean;
  gray?: boolean;
  danger?: boolean;
  warning?: boolean;
  success?: boolean;
  info?: boolean;
  radius?: number | string;
  height?: number | string;
  width?: number | string;
  margin?: number | string;
  marginBottom?: number | string;
  marginTop?: number | string;
  marginHorizontal?: number | string;
  marginVertical?: number | string;
  marginRight?: number | string;
  marginLeft?: number | string;
  padding?: number | string;
  paddingBottom?: number | string;
  paddingTop?: number | string;
  paddingHorizontal?: number | string;
  paddingVertical?: number | string;
  paddingRight?: number | string;
  paddingLeft?: number | string;
  justify?: string;
  align?: string;
  flex?: boolean;
  wrap?: string;
  blur?: boolean;
  intensity?: boolean;
  tint?: boolean;
  position?: string;
  disable?: boolean;
  right?: number;
  left?: number;
  top?: number;
  bottom?: number;
  end?: boolean;
  start?: boolean;
  bgColor?: string;
  neumorphism?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: any;
}

export interface ILineProps {
  barcode: IBarcode;
}

export interface IWellVisualProps {
  barcode: IBarcode;
  style?: CSSProperties;
  active: number;
  markActive: (id: number) => void;
  showResults?: boolean;
  testmethod: ITestProcedure;
}

export interface IText {
  [x: string]: any;
  id?: "Text";
  children?: JSX.Element;
  style?: React.CSSProperties;
  center?: boolean;
  gradient?: string;
  color?: string;
  opacity?: number;
  primary?: string;
  secondary?: string;
  tertiary?: string;
  black?: string;
  white?: boolean;
  gray?: string;
  danger?: string;
  warning?: string;
  success?: string;
  info?: string;
  size?: string;
  bold?: string;
  semibold?: string;
  weight?: string;
  h1?: string;
  h2?: string;
  h3?: string;
  h4?: string;
  h5?: string;
  h6?: string;
  p?: string;
  font?: string;
  align?: string;
  transform?: string;
  lineHeight?: string;
  position?: string;
  right?: number;
  left?: number;
  top?: number;
  bottom?: number;
  start?: number;
  end?: number;
  marginBottom?: number;
  marginTop?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  marginRight?: number;
  marginLeft?: number;
  paddingBottom?: number;
  paddingTop?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingRight?: number;
  paddingLeft?: number;
}
