const ButtonArea = (props: { children: JSX.Element; noborder?: boolean }) => {
  const { children, noborder, ...rest } = props;
  const buttonAreaClass = [noborder && 'noborder', 'buttonArea']
    .filter((el) => typeof el != undefined && el != false)
    .join(' ');
  return (
    <div className={buttonAreaClass} {...rest}>
      {children}
    </div>
  );
};

export default ButtonArea;
