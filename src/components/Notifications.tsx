function Notifications(props: { children: JSX.Element | number }) {
  const { children, ...rest } = props;
  return (
    <div className="badge" {...rest}>
      {children}
    </div>
  );
}

export default Notifications;
