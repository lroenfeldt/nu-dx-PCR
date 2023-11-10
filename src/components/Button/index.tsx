import React from "react";
import useButtonStyle from "./useButtonStyle";
import { IButtonProps } from "../../types/components";
import { borders, useTheme } from "../../assets/theme";
const Button: React.FC<IButtonProps> = (props) => {
  const {
    id = "button",
    onClick,
    children,
    navigation,
    style,
    shadow = false,
    card,
    center,
    outlined,
    overflow,
    row,
    safe,
    keyboard,
    scroll,
    color,
    gradient,
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
    radius,
    height,
    width,
    margin,
    marginBottom,
    marginTop,
    marginHorizontal,
    marginVertical,
    marginRight,
    marginLeft,
    padding,
    paddingBottom,
    paddingTop,
    paddingHorizontal,
    paddingVertical,
    paddingRight,
    paddingLeft,
    justify,
    align,
    flex,
    wrap,
    blur,
    intensity,
    tint,
    position,
    disabled,
    disable,
    right,
    left,
    top,
    bottom,
    end,
    start,
    neumorphism,
    bgColor,
    rounded,
    ...rest
  } = props;
  const { colors } = useTheme();
  const colorIndex = primary
    ? "primary"
    : secondary
    ? "secondary"
    : info
    ? "info"
    : success
    ? "success"
    : warning
    ? "warning"
    : white
    ? "white"
    : "";

  const buttonColor = colorIndex && (color || colors?.[colorIndex].main);
  const buttonTheme = useButtonStyle();
  const buttonStyles = {
    ...buttonTheme.button,
    ...style,
    ...(primary && {
      color: colors.white.main,
      backgroundColor: colors.primary.main,
    }),
    ...(color && { color: color }),
    ...(!outlined && !secondary && { border: 0 }),
    ...(margin !== undefined && { margin }),
    ...(marginBottom && { marginBottom }),
    ...(marginTop && { marginTop }),
    ...(marginHorizontal && { marginHorizontal }),
    ...(marginVertical && { marginVertical }),
    ...(marginRight && { marginRight }),
    ...(marginLeft && { marginLeft }),
    ...(padding !== undefined && { padding }),
    ...(paddingBottom && { paddingBottom }),
    ...(paddingTop && { paddingTop }),
    ...(paddingHorizontal && { paddingHorizontal }),
    ...(paddingVertical && { paddingVertical }),
    ...(paddingRight && { paddingRight }),
    ...(paddingLeft && { paddingLeft }),
    ...(radius && { borderRadius: radius }),
    ...(height && { height }),
    ...(width && { width }),
    ...(overflow && { overflow }),
    ...(flex && { flex }),
    ...(row && { flexDirection: "row" }),
    ...(align && { alignItems: align }),
    ...(center && { justifyContent: "center" }),
    ...(justify && { justifyContent: justify }),
    ...(wrap && { flexWrap: wrap }),
    ...(buttonColor && { backgroundColor: buttonColor }),
    ...(secondary && {
      backgroundColor: colors.white.main,
      color: colors.secondary.main,
      border: `4px solid ${colors.secondary.main}`,
    }),
    ...(bgColor && { backgroundColor: bgColor }),
    ...(outlined && {
      border: `${borders.borderWidth.input}px solid ${colors.primary.main}`,
      color: secondary ? colors.secondary.main : colors.primary.main,
      backgroundColor: "transparent",
    }),
    ...(position && { position }),
    ...(right !== undefined && { right }),
    ...(left !== undefined && { left }),
    ...(top !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
    ...(end !== undefined && { end }),
    ...(disabled && { opacity: 0.5 }),
    ...(disable && { opacity: 0.5 }),
    ...(start !== undefined && { start }),
    ...(rounded && {
      borderRadius: "100%",
      padding: 16,
    }),
  } as React.CSSProperties;

  return (
    <button style={{ ...buttonStyles }} {...rest} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
