import './Button.css';

const Button = (props: {
  id?: 'button' | undefined;
  className: string | undefined;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children: JSX.Element | undefined;
  navigation: string | undefined;
  style: {} | undefined;
  shadow?: boolean | undefined;
  card: string | undefined;
  center: string | undefined;
  outlined: string | undefined;
  overflow: string | undefined;
  row: string | undefined;
  safe: string | undefined;
  keyboard: string | undefined;
  scroll: string | undefined;
  color: string | undefined;
  gradient: string | undefined;
  primary: string | undefined;
  secondary: string | undefined;
  tertiary: string | undefined;
  black: string | undefined;
  white: string | undefined;
  gray: string | undefined;
  danger: string | undefined;
  warning: string | undefined;
  success: string | undefined;
  info: string | undefined;
  radius: string | undefined;
  height: number | undefined;
  width: number | undefined;
  margin: number | undefined;
  marginBottom: number | undefined;
  marginTop: number | undefined;
  marginHorizontal: number | undefined;
  marginVertical: number | undefined;
  marginRight: number | undefined;
  marginLeft: number | undefined;
  padding: number | undefined;
  paddingBottom: number | undefined;
  paddingTop: number | undefined;
  paddingHorizontal: number | undefined;
  paddingVertical: number | undefined;
  paddingRight: number | undefined;
  paddingLeft: number | undefined;
  justify: string | undefined;
  align: string | undefined;
  flex?: number | undefined;
  wrap: string | undefined;
  blur: string | undefined;
  intensity: string | undefined;
  tint: string | undefined;
  position: any;
  disable: string | undefined;
  right: number | undefined;
  left: number | undefined;
  top: number | undefined;
  bottom: number | undefined;
  end: number | undefined;
  start: number | undefined;
  neumorphism: string | undefined;
}) => {
  const {
    id = 'button',
    onClick,
    className,
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
    flex = 1,
    wrap,
    blur,
    intensity,
    tint,
    position,
    disable,
    right,
    left,
    top,
    bottom,
    end,
    start,
    neumorphism,
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
  const buttonColor = color || colors?.[colorIndex];

  const buttonStyles = {
    ...style,
    // ...(primary && { color: colors.WHITE }),
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
    ...(flex !== undefined && { display: 'flex', flex }),
    ...(row && { flexDirection: 'row' }),
    ...(align && { alignItems: align }),
    ...(center && { justifyContent: 'center' }),
    ...(justify && { justifyContent: justify }),
    ...(wrap && { flexWrap: wrap }),
    ...(buttonColor && { backgroundColor: buttonColor }),
    ...(outlined && {
      borderWidth: 1,
      // borderColor: buttonColor,
      backgroundColor: 'transparent',
    }),
    ...(position && { position }),
    ...(right !== undefined && { right }),
    ...(left !== undefined && { left }),
    ...(top !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
  };
  const buttonClasses = [
    shadow && 'shadow',
    card && 'card',
    safe && 'safe',
    neumorphism && 'neumorphism',
    disable && 'disable',
  ]
    .filter((el) => typeof el != undefined && el != false)
    .join(' ');

  return (
    <button className={buttonClasses} style={{ ...buttonStyles }} {...rest} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
