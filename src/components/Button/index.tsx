import { IButton } from '../../types/interfaces/components';
import './Button.css';

const Button = (props: IButton) => {
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
