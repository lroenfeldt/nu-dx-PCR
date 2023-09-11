import  pxToRem  from './pxToRem';
import rgba from "./rgba";

import { TBoxShadow } from '../types/functions';

const boxShadow: TBoxShadow= (offset = [0, 0], radius = [0, 0], color, opacity, inset = "")=> {
	const [x, y] = offset;
	const [blur, spread] = radius;

	return `${inset} ${pxToRem(x)} ${pxToRem(y)} ${pxToRem(blur)} ${pxToRem(spread)} ${rgba(color?color:"", opacity?opacity:0)}`;
}

export default boxShadow;

type pxToRem=(number: number, baseNumber: number )=>string;