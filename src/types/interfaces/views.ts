import { IBarcode } from "./interfaces";

export interface IActionsSectionProps {
  active: number;
  barcodesValid: boolean;
  getBarcode: (active: number) => IBarcode;
}

export interface IBarcodeKeyboardProps {
  active: number;
  nextWell: (next: boolean) => void;
  getBarcode: (active: number) => IBarcode;
  inputs: Record<string, string>;
  inputName: string;
  onKeyPress: (e: string) => void;
  setInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  clear: boolean;
  setClear: React.Dispatch<React.SetStateAction<boolean>>;
  keyboardActive: boolean;
  setKeyboardActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IErrorBadgeProps {
  error: string;
}

export interface IInputComponentProps {
  active: number;
  updateBarcode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getBarcode: (active: number) => IBarcode;
}

export interface IInputSectionProps {
  active: number;
  updateBarcode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextWell: (next: boolean) => void;
  disabled: boolean;
  keyboardActive: boolean;
  setKeyboardActive: (active: boolean) => void;
  getBarcode: (active: number) => IBarcode;
}

export interface IUseNextWell {
  active: number;
  markActive: (active: number) => void;
  checkBarcode: (active: number) => void;
}
