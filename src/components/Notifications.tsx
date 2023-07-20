function Notifications(props: { children: JSX.Element }) {
  const { children, ...rest } = props;
  return (
    <div className="badge" {...rest}>
      {children}
    </div>
  );
}

export default Notifications;
