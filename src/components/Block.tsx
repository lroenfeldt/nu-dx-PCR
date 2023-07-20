function Block(props: {
  row: number;
  top: number;
  end: any;
  gray: any;
  info: any;
  wrap: any;
  blur: any;
  tint: any;
  left: number;
  style: React.CSSProperties | undefined;
  color: string;
  black: any;
  white: boolean;
  width: number;
  align: string;
  right: any;
  start: any;
  shadow: any;
  center: boolean;
  scroll: any;
  danger: any;
  radius: number;
  height: number;
  margin: number;
  bottom: number;
  border: string;
  primary: any;
  warning: any;
  success: any;
  padding: number;
  justify: string | undefined;
  children: JSX.Element;
  outlined: any;
  overflow: string;
  tertiary: any;
  flex?: number;
  position: string;
  secondary: any;
  marginTop: number;
  intensity: any;
  marginLeft: number;
  paddingTop: number;
  marginRight: number;
  paddingLeft: number;
  borderColor: string;
  marginBottom: number;
  paddingRight: number;
  paddingBottom: number;
  marginVertical: number;
  paddingVertical: number;
  marginHorizontal: number;
  paddingHorizontal: number;
  column: number;
  transition: any;
  gap: string | undefined;
  zIndex: number;
}) {
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
    transition,
    gap,
    zIndex,
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
    : 'info';
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
    ...(scroll && { overflowY: 'scroll' }),
    ...(blur && { backdropFilter: `blur(${blur}px)` }),
    ...(tint && { WebkitBackdropFilter: `blur(${blur}px)`, backdropFilter: `blur(${blur}px)` }),
    ...(intensity && { WebkitBackdropFilter: `brightness(${intensity}%)` }),
    ...(transition && { transition: transition }),
    ...(outlined && {
      borderWidth: 1,
      backgroundColor: 'transparent',
    }),
    ...(blockColor && { backgroundColor: blockColor }),
    ...(shadow && {
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
    }),
    ...(position && { position }),
    ...(zIndex && { zIndex }),
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
