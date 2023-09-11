import React, { FC, InputHTMLAttributes, forwardRef, useEffect } from "react";
import { useTheme } from "../../assets/theme";

interface TInputProps extends InputHTMLAttributes<HTMLInputElement> {
	error?: boolean;
	success?: boolean;
	primary?: boolean;
	secondary?: boolean;
	warning?: boolean;
	info?: boolean;
	outlined?: boolean;
	rounded?: boolean;
	style?: React.CSSProperties;
	width?: string;
	height?: string;
	padding?: string;
	gap?: string | number;
	[key: string]: any; // TODO: remove this line
}

const Input = forwardRef<HTMLInputElement, TInputProps>((props, ref) => {
	const {
		error,
		success,
		primary,
		secondary,
		warning,
		info,
		outlined,
		rounded,
		style,
		width = 289,
		height = 64,
		padding = "13px 30px",
		gap = 10,
		borderWidth = 4,
		radius,
		...rest
	} = props;

	const { colors, borders } = useTheme();
	useEffect(() => {
		const input = document.querySelector("input");
		input?.addEventListener("focus", () => {
			input.style.borderColor = colors.secondary.main as string;
		});
		const css = `
    input {
      color: ${colors.secondary.main};
      
    }
    input:focus {
      border-color: ${colors.primary.main};
    }
    input::placeholder {
      color: ${colors.test.main};
    }
    `;
		const style = document.createElement("style");
		style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	}, []);

	const baseStyles: React.CSSProperties = {
		border: `4px solid ${colors.secondary.main}`,
		caretColor: colors.secondary.main,
		caretShape: "block",
		textAnchor: colors.test.main,
		fontSize: 28,
		fontWeight: 600,
		lineHeight: 48,
		...(outlined && { borderWidth: 1, borderColor: "gray" }),
		...(rounded && { borderRadius: borders.borderRadius.input }),
		...(primary && { borderColor: colors.primary.main }),
		...(secondary && { borderColor: colors.secondary.main }),
		...(warning && { borderColor: colors.warning.main }),
		...(success && { borderColor: colors.success.main }),
		...(error && { borderColor: colors.error.main }),
		...(info && { borderColor: colors.info.main }),
		...(width && { width: width }),
		...(height && { height: height }),
		...(padding && { padding: padding }),
		...(gap && { gap: gap }),
		...(borderWidth && { borderWidth: borderWidth }),
		...(radius && { borderRadius: radius }),
		...style,
	};

	return <input ref={ref} style={baseStyles} {...rest} />;
});

export default Input;
