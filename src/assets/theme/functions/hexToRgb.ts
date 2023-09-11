
import chroma from "chroma-js";
import { THexToRgb } from "../types/functions";

const hexToRgb: THexToRgb = (color)=> {
  return chroma(color).rgb().join(", ");
}

export default hexToRgb;
