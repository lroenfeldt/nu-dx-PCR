/**
  The pxToRem() function helps you to convert a px unit into a rem unit, 
 */

import { TPxToRem } from "../types/functions";

const  pxToRem:TPxToRem = (number, baseNumber = 16) =>{
	return `${number / baseNumber}rem`;
}

export default pxToRem;
