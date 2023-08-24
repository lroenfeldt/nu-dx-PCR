import React, { ReactNode, CSSProperties, ButtonHTMLAttributes  } from 'react';
import { IAccountUser } from '../interfaces/settings';

type ColorsType = 'primary' | 'secondary' | 'tertiary' | 'black' | 'white' | 'gray' | 'danger' | 'warning' | 'success' | 'info';

export type TBlockProps = {
  row?: boolean,
  top?: number | string,
  end?: boolean,
  gray?: boolean,
  info?: boolean,
  wrap?: boolean,
  blur?: number | string,
  tint?: boolean,
  left?: number | string,
  style?: CSSProperties,
  color?: string,
  black?: boolean,
  white?: boolean,
  width?: string | number,
  align?: string,
  right?: number | string,
  start?: boolean,
  shadow?: boolean,
  center?: boolean,
  scroll?: boolean,
  danger?: boolean,
  radius?: number | string,
  height?: string | number,
  margin?: number | string,
  bottom?: number | string,
  border?: string,
  primary?: boolean,
  warning?: boolean,
  success?: boolean,
  padding?: number | string,
  justify?: string,
  children?: ReactNode,
  outlined?: boolean,
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto',
  tertiary?: boolean,
  flex?: number | string,
  position?: 'absolute' | 'relative' | 'fixed' | 'static' | 'sticky',
  secondary?: boolean,
  marginTop?: number | string,
  intensity?: number | string,
  marginLeft?: number | string,
  paddingTop?: number | string,
  marginRight?: number | string,
  paddingLeft?: number | string,
  borderColor?: string,
  marginBottom?: number | string,
  paddingRight?: number | string,
  paddingBottom?: number | string,
  marginVertical?: number | string,
  paddingVertical?: number | string,
  marginHorizontal?: number | string,
  paddingHorizontal?: number | string,
  column?: boolean,
  transition?: string,
  gap?: number | string,
  zIndex?: number | string,
  [key: string]: any
};

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
  onChange?: ((input: string, e?: MouseEvent | undefined) => string) | undefined | ((value: string) => void);
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  setInputs: React.Dispatch<React.SetStateAction<InputsType>>;
  inputName: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isNumeric?: boolean;
  inputValue: string | boolean | null;
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
  flex?: number;
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
  neumorphism?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: any;
}