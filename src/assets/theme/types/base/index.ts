import { IColors } from "./colors";
import { IGlobals } from "./globals";
import { IBoxShadows } from "./boxShadows";
import { ITypography } from "./typography";

export interface IBreakpoints {
  values: Record<string, number>;
}

export interface IBorders {
  borderColor: string;
  borderWidth: Record<string | number, string | number>;
  borderRadius: {
    main: number | string;
		probe:number | string;
		card: number | string;
		closeButton: number | string;
    input: number | string;
    badge: number | string;

  }
}

export interface ITheme {
  colors: IColors;
  borders: IBorders;
  boxShadows: IBoxShadows;
  breakpoints: IBreakpoints;
  globals: IGlobals;
  typography: ITypography;
}