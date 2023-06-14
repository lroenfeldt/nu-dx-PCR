import React from 'react';

function Block(props) {
  const {
    row,
    top,
    end,
    gray,
    info,
    wrap,
    blur,
    tint,
    left,
    style,
    color,
    black,
    white,
    width,
    align,
    right,
    start,
    shadow,
    center,
    scroll,
    danger,
    radius,
    height,
    margin,
    bottom,
    border,
    primary,
    warning,
    success,
    padding,
    justify,
    children,
    outlined,
    overflow,
    tertiary,
    flex = 1,
    position,
    secondary,
    marginTop,
    intensity,
    marginLeft,
    paddingTop,
    marginRight,
    paddingLeft,
    borderColor,
    marginBottom,
    paddingRight,
    paddingBottom,
    marginVertical,
    paddingVertical,
    marginHorizontal,
    paddingHorizontal,
    column,
    gap,
    ...rest
  } = props;
  const colors = {
    primary: 'var(--primary)',
    secondary: '#CE0808',
    tertiary: '#E28337',
    black: '#000',
    white: '#FFF',
    gray: '#E0E0E0',
    danger: '#CE0808',
    warning: '#E28337',
    success: '#80C180',
    info: '#E28337',
    shadow: '#000000',
  };
  const colorIndex = primary
    ? 'primary'
    : secondary
    ? 'secondary'
    : tertiary
    ? 'tertiary'
    : black
    ? 'black'
    : white
    ? 'white'
    : gray
    ? 'gray'
    : danger
    ? 'danger'
    : warning
    ? 'warning'
    : success
    ? 'success'
    : info
    ? 'info'
    : null;
  const blockColor = color || colors?.[colorIndex];
  const blockStyles = {
    ...style,
    ...(flex && { display: 'flex' }),
    ...(border && {
      border: border,
    }),
    ...(borderColor && { borderColor }),
    ...(color && { color }),
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
    ...(marginBottom && { marginBottom }),
    ...(paddingVertical && { paddingVertical }),
    ...(paddingRight && { paddingRight }),
    ...(paddingLeft && { paddingLeft }),
    ...(radius && { borderRadius: radius }),
    ...(height && { height }),
    ...(width && { width }),
    ...(overflow && { overflow }),
    ...(row && { flexDirection: 'row' }),
    ...(column && { flexDirection: 'column' }),
    ...(gap && { gap: gap }),
    ...(align && { alignItems: align }),
    ...(center && { justifyContent: 'center' }),
    ...(justify && { justifyContent: justify }),
    ...(wrap && { flexWrap: wrap }),
    ...(outlined && {
      borderWidth: 1,
      backgroundColor: 'transparent',
    }),
    ...(blockColor && { backgroundColor: blockColor }),
    ...(shadow && {
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
    }),
    ...(position && { position }),
    ...(right !== undefined && { right }),
    ...(left !== undefined && { left }),
    ...(top !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
  };
  return (
    <div style={{ ...blockStyles }} {...rest}>
      {children}
    </div>
  );
}

export default Block;
