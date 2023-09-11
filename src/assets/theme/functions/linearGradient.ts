/**
  The linearGradient() function helps you to create a linear gradient color background
 */

import { TLinearGradient } from "../types/functions";

const  linearGradient: TLinearGradient = (color, colorState, angle = 310) =>{
	return `linear-gradient(${angle}deg, ${color}, ${colorState})`;
}

export default linearGradient;
