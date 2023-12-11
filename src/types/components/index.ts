import React, { ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";
import {
  IAccountUser,
  ISettings,
  ITestProcedure,
} from "../interfaces/settings";
import { IBarcode } from "../interfaces/interfaces";
import { ITestMethod } from "../interfaces/parseResults";

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
  alignCenter?: boolean;
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
  grid?: boolean;
  spaceBetween?: boolean;
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
  bgColor?: string | null;
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
  dropShadowLarge?: boolean;
  dropShadowSmall?: boolean;
  innerShadow?: boolean;
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
  inputValue: string | boolean | null;
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
  disabled?: boolean;
  disable?: boolean;
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
  icon?: JSX.Element;
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
  testmethod?: ITestMethod;
}

export interface IResultsFooterProps {
  activeBarcode: IBarcode;
  testmethod: ITestProcedure;
  settings: ISettings;
  barcodes: IBarcode[];
  locale?: string;
  navigate: (path: string) => void;
}

export interface IPaginationBulletsProps {
  numberOfPages: number;
  currentPage: number;
  goToPage: (pageIndex: number) => void;
}

export interface ITestInfoDetailProps {
  Icon: React.ComponentType;
  title: string;
  detail: string;
  styles: { [key: string]: React.CSSProperties };
}

export interface ITestInfoQrSectionProps {
  styles: { [key: string]: React.CSSProperties };
}

export interface ITestInfoProps {
  onClose: () => void;
  selectTest?: () => void;
}

export interface ITestmethodProps {
  title: string;
  status: string;
  methodid: string | number;
  image: string;
  openInfos: () => void;
}

export interface ITextProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  fontSize?: string;
  color?: string;
  fontWeight?: number;
  textAlign?: string;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  p?: boolean;
  className?: string;
  animated?: boolean;
  animationType?: string;
  padding?: string;
  margin?: string;
  fontFamily?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  textTransform?: string;
  whiteSpace?: string;
  wordBreak?: string;
  wordWrap?: string;
  overflow?: string;
  textOverflow?: string;
  verticalAlign?: string;
  direction?: string;
  cardTitle?: boolean;
  white?: boolean;
  black?: boolean;
  primary?: boolean;
  secondary?: boolean;
  warning?: boolean;
  success?: boolean;
  error?: boolean;
  grey?: boolean;
  bold?: boolean;
  label?: boolean;
  small?: boolean;
}

export interface ContainerProps {
  children: ReactNode;
}

export interface MenuItemProps {
  IconComponent: React.FC<any>;
  label: string;
  iconProps?: Record<string | number, string | number>;
  onClick: () => void;
}
export interface ControlMenuItemProps {
  IconComponent: React.FC<any>;
  label: string;
  iconProps?: Record<string | number, string | number>;
  onClick: () => void;
}
export enum Menus {
  MAIN = "main",
  HELP = "help",
  PROFIL = "profil",
  SYSTEM = "system",
  SHUTDOWN = "shutdown",
  OPENLID = "openlid",
}

export interface TLabelProps {
  flex?: boolean;
  row?: boolean;
  align?: string;
  gap?: number;
  padding?: string;
  border?: string;
  radius?: number;
  width?: number;
  cursor?: string;
  children?: ReactNode;
  htmlFor?: string;
  [key: string]: any;
}

export interface IOvalSPinner {
  size: string;
}

export interface IViewResultsModal {
  onClose: () => void;
}

export interface IModalProps {
  children: JSX.Element;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  style?: React.CSSProperties;
}

export interface ModalProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
