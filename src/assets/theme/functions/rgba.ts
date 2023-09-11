import { TRgba } from "../types/functions";
import hexToRgb from "./hexToRgb";

const rgba: TRgba = (color, opacity)=> {
	return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
