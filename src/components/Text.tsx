import { IText } from "../types/interfaces/components";

function Text(props: IText) {
	const {
		id = "Text",
		children,
		style,
		center,
		gradient,
		color,
		opacity,
		primary,
		secondary,
		tertiary,
		black,
		white,
		gray,
		danger,
		warning,
		success,
		info,
		size,
		bold,
		semibold,
		weight,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		p,
		font,
		align,
		transform,
		lineHeight,
		position,
		right,
		left,
		top,
		bottom,
		start,
		end,
		marginBottom,
		marginTop,
		marginHorizontal,
		marginVertical,
		marginRight,
		marginLeft,
		paddingBottom,
		paddingTop,
		paddingHorizontal,
		paddingVertical,
		paddingRight,
		paddingLeft,
		...rest
	} = props;
	const textStyles: Object = [
		style,
		{
			...(marginBottom && { marginBottom }),
			...(marginTop && { marginTop }),
			...(marginHorizontal && { marginHorizontal }),
			...(marginVertical && { marginVertical }),
			...(marginRight && { marginRight }),
			...(marginLeft && { marginLeft }),
			...(paddingBottom && { paddingBottom }),
			...(paddingTop && { paddingTop }),
			...(paddingHorizontal && { paddingHorizontal }),
			...(paddingVertical && { paddingVertical }),
			...(paddingRight && { paddingRight }),
			...(paddingLeft && { paddingLeft }),
			...(center && { textAlign: "center" }),
			...(align && { textAlign: align }),
			...(bold && { fontFamily: bold }),
			...(semibold && { fontFamily: semibold }),
			...(weight && { fontWeight: weight }),
			...(transform && { textTransform: transform }),
			...(font && { fontFamily: font }),
			...(size && { fontSize: size }),
			...(color && { color }),
			...(opacity && { opacity }),
			...(lineHeight && { lineHeight }),
			...(position && { position }),
			...(right !== undefined && { right }),
			...(left !== undefined && { left }),
			...(top !== undefined && { top }),
			...(bottom !== undefined && { bottom }),
		},
	];

	if (p) {
		return (
			<p style={textStyles} {...rest}>
				{children}
			</p>
		);
	}
	if (h1) {
		return (
			<h1 style={textStyles} {...rest}>
				{children}
			</h1>
		);
	}
	if (h2) {
		return (
			<h2 style={textStyles} {...rest}>
				{children}
			</h2>
		);
	}
	if (h3) {
		return (
			<h3 style={textStyles} {...rest}>
				{children}
			</h3>
		);
	}
	if (h4) {
		return (
			<h4 style={textStyles} {...rest}>
				{children}
			</h4>
		);
	}
	if (h5) {
		return (
			<h5 style={textStyles} {...rest}>
				{children}
			</h5>
		);
	}
	if (h6) {
		return (
			<h6 style={textStyles} {...rest}>
				{children}
			</h6>
		);
	}
}

export default Text;
