export interface IOffset {
  x: number;
  y: number;
}[]

export interface IRadius {
  blur: number;
  spread: number;
}[]

export type THexToRgb = (color: string) => string;
export type TRgba = (color: string, opacity: number) => string;
export type TPxToRem = (number: number, baseNumber?: number) => string;
export type TLinearGradient = (color: string, colorState: string, angle?: number) => string;
export type TBoxShadow = (offset?: [number, number], radius?: [number, number], color?: string, opacity?: number, inset?: string) => string;
