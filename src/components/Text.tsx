function Text(props: {
  [x: string]: any;
  id?: 'Text' | undefined;
  children: JSX.Element;
  style?: React.CSSProperties | undefined;
  center: any;
  gradient: any;
  color: string;
  opacity: number;
  primary: any;
  secondary: any;
  tertiary: any;
  black: any;
  white: any;
  gray: any;
  danger: any;
  warning: any;
  success: any;
  info: any;
  size: any;
  bold: any;
  semibold: any;
  weight: any;
  h1: any;
  h2: any;
  h3: any;
  h4: any;
  h5: any;
  h6: any;
  p: any;
  font: any;
  align: any;
  transform: any;
  lineHeight: any;
  position: any;
  right: any;
  left: any;
  top: any;
  bottom: any;
  start: any;
  end: any;
  marginBottom: any;
  marginTop: any;
  marginHorizontal: any;
  marginVertical: any;
  marginRight: any;
  marginLeft: any;
  paddingBottom: any;
  paddingTop: any;
  paddingHorizontal: any;
  paddingVertical: any;
  paddingRight: any;
  paddingLeft: any;
}) {
  const {
    id = 'Text',
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
  const textStyles: any = [
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
      ...(center && { textAlign: 'center' }),
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
