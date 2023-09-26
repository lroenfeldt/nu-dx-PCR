import React from "react";
import useTextTheme from "./useTextTheme";
import { useTheme } from "../../assets/theme/ThemeContext";
interface ITextProps extends React.HTMLAttributes<HTMLElement> {
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

const Text: React.FC<ITextProps> = (props) => {
	const {
		as = "p",
		children,
		fontSize,
		color,
		fontWeight,
		textAlign,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		className,
		animated,
		animationType,
		padding,
		margin,
		fontFamily,
		fontStyle,
		lineHeight,
		letterSpacing,
		textDecoration,
		textTransform,
		whiteSpace,
		wordBreak,
		wordWrap,
		overflow,
		textOverflow,
		verticalAlign,
		direction,
		cardTitle,
		white,
		black,
		primary,
		secondary,
		warning,
		success,
		error,
		grey,
		bold,
		label,
		small,
		...rest
	} = props;

	let TagName = as as keyof JSX.IntrinsicElements | React.ComponentType<any>;
	if (p) TagName = "p";
	if (h1) TagName = "h1";
	if (h2) TagName = "h2";
	if (h3) TagName = "h3";
	if (h4) TagName = "h4";
	if (h5) TagName = "h5";
	if (h6) TagName = "h6";
	if (cardTitle) TagName = "h2";
	const textTheme = useTextTheme();
	const { colors } = useTheme();
	const baseStyle: React.CSSProperties = {
		...(as && textTheme[TagName as keyof typeof textTheme]),
		...(cardTitle && { ...textTheme.cardTitle, ...textTheme.h2 }),
		...(fontSize && { fontSize }),
		...(fontWeight && { fontWeight }),
		...(textAlign && { textAlign }),
		...(padding && { padding }),
		...(margin && { margin }),
		...(fontFamily && { fontFamily }),
		...(fontStyle && { fontStyle }),
		...(lineHeight && { lineHeight }),
		...(letterSpacing && { letterSpacing }),
		...(textDecoration && { textDecoration }),
		...(textTransform && { textTransform }),
		...(whiteSpace && { whiteSpace }),
		...(wordBreak && { wordBreak }),
		...(wordWrap && { wordWrap }),
		...(overflow && { overflow }),
		...(textOverflow && { textOverflow }),
		...(verticalAlign && { verticalAlign }),
		...(direction && { direction }),
		...(label && textTheme["label" as keyof typeof textTheme]),
		...(small && textTheme["small" as keyof typeof textTheme]),
		...(white && { color: colors.white.main }),
		...(black && { color: colors.black.main }),
		...(primary && { color: colors.primary.main }),
		...(secondary && { color: colors.secondary.main }),
		...(warning && { color: colors.warning.main }),
		...(success && { color: colors.success.main }),
		...(error && { color: colors.error.main }),
		...(color && { color }),
		...(grey && { color: colors.grey[100] }),
		...(bold && { fontWeight: 600 }),
	} as React.CSSProperties;

	const animationStyle: React.CSSProperties = animated ? { animation: `${animationType} 1s ease-in-out` } : {};

	const style = { ...baseStyle, ...animationStyle, ...rest?.style };

	return (
		<TagName className={className} {...rest} style={style}>
			{children}
		</TagName>
	);
};

export default Text;
